"use strict"
/**
* js 文件依赖
*/
import * as util  from '../util';
import * as path  from 'path';
import * as fs  from 'fs';
import * as config  from '../config';
import {Vinyl}  from 'vinyl';
import {default as dependent, MapModle} from './index';

class JsDependent {

    alias = config.alias || {}

    reg = /((require|async)\(['"])([^'"]+)(['"]\))/g

    /**
 * 依赖获取
 * @param  contents 文件内容
 * @param  bl s
 */
    async getMap(vinyl: Vinyl): Promise<MapModle> {

        let depArr = util.regexMatch(vinyl.contents.toString(), this.reg, 3);
        let url = path.normalize(vinyl.path);
        let depObj: {
            [key: string]: string
        } = {};

        for (var i in depArr) {
            var value = depArr[i];
            depArr[i] = util.clearPath(await this.normalize(url, value));
            depObj[value] = depArr[i];
        }

        return {
            dep: util.clearSameByArr(depArr),
            depObj: depObj
        };
    }

    /**
     * 依赖替换
     * @param vinyl
     */
    async replace(vinyl: Vinyl): Promise<Vinyl> {
        try {

            let contents = vinyl.contents.toString();
            let thisMap = dependent.getMap(vinyl.path);

            contents = contents.replace(this.reg, (word, $1, $2, $3, $4) => {
                if (this.isAlias($3)) {
                    return word;
                } else {
                    let map = dependent.getMap(thisMap.depObj[$3]);
                    return $1 + dependent.getMd5Path($3, map.md5) + $4;
                }
            });

            vinyl.contents = new Buffer(contents);
            return vinyl;
        } catch (e) {
            util.log(e);
            throw e;
        }
    }



    /**
     * 依赖替换  nodejs 用的 dep 替换
     * @param vinyl
     */
    async depReplace(vinyl: Vinyl): Promise<Vinyl> {
        var contents = vinyl.contents.toString();
        var depArr = contents.match(/require\(('|").*?(?=(' | "|)\))/g);

        var url = path.normalize(vinyl.path);
        for (var i in depArr) {
            var value = depArr[i];
            var reqUrl = value.replace(/^require\(('|")/, '');
            var reqValue = value.replace(reqUrl, (await this.normalize(url, path.normalize(reqUrl))));
            contents.replace(value, reqUrl);
        }
        vinyl.contents = new Buffer(contents);
        return vinyl;
    }

    /**
    * 依赖获取 全部文件只有相对路径文件
    * @param  vinyl
    */
    async getRelativeVinyl(vinyl: Vinyl, pathArr: Set<string> = new Set()): Promise<Set<Vinyl>> {
        try {
            var vinylArr = new Set<Vinyl>();

            var depArr = this.matchDep(vinyl.contents.toString());
            depArr = Array.from(await this.ariRelativePathArr(vinyl.path, depArr));

            for (let value of depArr) {
                if (!pathArr.has(value)) {
                    pathArr.add(value);
                    let vinyl = await dependent.getVinylByUrl(value);
                    vinylArr.add(vinyl);
                    util.concatSet(vinylArr, await this.getRelativeVinyl(vinyl, pathArr))
                }
            }
            return vinylArr;
        } catch (e) {
            console.log(e);
        }
    }


    /**
     * 计算相对路径为绝对路径
     * @param path
     * @param url
     */
    async ariRelativePathArr(path: string, url: string[]): Promise<Set<string>> {
        var urlSet = new Set<string>();

        for (var value of url) {
            if (this.isRelativePath(value)) {
                urlSet.add((await this.normalize(path, value)));
            }
        }
        return urlSet;
    }


    /**
     * 搜索依赖
     * @param contents
     */
    matchDep(contents: string): string[] {
        return util.regexMatch(contents, this.reg, 2);
    }


    /**
    * js 文件依赖判断 是否是别名
    * @param  str 路径名称
    */
    isAlias(url: string) {
        var extname = path.extname(url);
        var reg = new RegExp('^' + config.isFile + '$', 'g')
        return url.indexOf('/') == -1 && url.indexOf('\\') == -1 && !(reg.test(extname));
    }


    /**
    * js 文件依赖判断 是否是别名
    * @param  str 路径名称
    */
    isRelativePath(url: string) {
        return url.indexOf('.') == 0;
    }


    /**
    * 根据url 计算他的dep依赖地址
    * @param  str 路径名称
    */
    async normalize(url: string, dep: string): Promise<string> {
        if (!this.isRelativePath(dep)) {
            return dep;
        };

        dep = path.join(path.dirname(url), dep);
        var stats = await dependent.fsStats(dep);

        if (stats) {
            if (!stats.isFile()) {
                dep += '/index.js';
            }
        } else {
            var stats = await dependent.fsStats(dep + '.js');
            if (stats) {
                dep += '.js';
            }
        }

        return dep;
    }

    /**  废弃
    * 根据别名获取路径
    * @param  alias 别名
    */
    async getUrlByAlias(alias: string): Promise<string> {
        var url: string = this.alias[alias];
        if (url) {
            return url;
        } else {
            url = await this.getUrlByAliasInWebModules(alias);
            if (url) {
                return url;
            } else {
                util.warn('别名未找到：' + alias);
                return;
            }
        }
    }

    /**
    * 根据别名在webModules中获取Url  废弃
    * @param  alias 别名
    */
    async getUrlByAliasInWebModules(alias: string) {
        var url = process.cwd() + '/' + config.webModules + alias + '/index.js';
        var stats = await dependent.fsStats(url);
        if (stats) {
            return url;
        }
    }
}


var jsDependent = new JsDependent();
export default jsDependent;


