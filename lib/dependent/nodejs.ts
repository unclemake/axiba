"use strict"
/**
* 依赖获取
*/
import * as path  from 'path';
import * as fs  from 'fs';
import {Vinyl}  from 'vinyl';
import * as gulp  from 'gulp';
import * as through  from 'through2';
import * as util  from '../util';
import umGulp  from '../gulp';
import jsDep from './js';
import dependent from './index';
import * as config from '../config';
import * as npm from 'npm';


/**
* nodejs模块地址和启动文件
*/
type PackageObj = {
    //模块名称和版本号  axiba@1.0.0
    [key: string]: Package
};

/**
* nodejs依赖结构
*/
type Package = {
    path?: string,
    version?: string,
    main?: string,
    dependencies?: Dependencies
}

/**
* nodejs依赖结构
*/
type Dependencies = {
    [key: string]: Package
}

export class NodeJsDep {

    /**
    * 根据模块名  依赖js文件
    * @param  模块名称
    */
    async getDepByName(name: string): Promise<Set<Vinyl>> {
        try {
            let dependencies = await this.ls();

            var dep: Dependencies = {};
            dep[name] = dependencies[name];
            if (!dep[name]) {
                util.error('未找到nodejs ' + name + ' 模块');
                return new Set([]);
            }
            dependencies = dep;
            let vinylArr = await this.getDep(dependencies);
            return vinylArr;
        } catch (e) {
            console.log(e);
        }
    }

    /**
    * 根据依赖列表获取所有 依赖js文件
    * @param  模块名称
    */
    async getDep(dependencies: Dependencies): Promise<Set<Vinyl>> {
        try {
            //获取模块启动main
            let vinylSet: Set<Vinyl> = new Set();
            for (let i in dependencies) {
                let value = dependencies[i];
                let url = value.path + '/' + (value.main || 'index.js');
                url = await this.normalize(url);

                let vinyl = await umGulp.getVinylByUrl(url);

                //获取所有依赖文件
                let allDep = await jsDep.getRelativeVinyl(vinyl);
                allDep.add(vinyl);

                for (let vinyl of allDep.keys()) {
                    vinyl = await this.aliasReplace(vinyl, value.dependencies);
                }

                vinylSet = util.concatSet(vinylSet, allDep);
                if (value.dependencies) {
                    let dep = await this.getDep(value.dependencies);
                    vinylSet = util.concatSet(vinylSet, dep);
                }
            }
            return vinylSet;
        } catch (e) {
            console.log(e);
        }
    }


    /**
     * 规范连接 让连接指向最终js
     * @param path
     */
    async normalize(url): Promise<string> {
        var stats = await dependent.fsStats(url);

        if (stats) {
            if (!stats.isFile()) {
                url += '/index.js';
            }
        } else {
            var stats = await dependent.fsStats(url + '.js');
            if (stats) {
                url += '.js';
            }
        }

        return url;
    }


    /**
     * 替换别名
     * @param vinyl
     * @param dependencies
     */
    async aliasReplace(vinyl: Vinyl, dependencies: Package): Promise<Vinyl> {
        try {
            var contents = vinyl.contents.toString();
            let depArr = contents.match(/require\(('|").*?(?=(' | "|)\))/g);
            for (let i in depArr) {
                // 全部dep
                let value = depArr[i];
                //require 头
                let reqUrl = value.match(/('|").+('|")/)[0].replace(/("|')/g, '');

                if (jsDep.isAlias(reqUrl)) {
                    let dependencie;
                    let url;
                    if (config.alias[reqUrl]) {
                        url = config.alias[reqUrl];
                    } else if (dependencies[reqUrl]) {
                        url = dependencies[reqUrl].path + '/' + (dependencies[reqUrl].main || 'index.js');
                    }

                    if (url) {
                        //拼接别名 url地址
                        url = util.clearPath(url);
                        url = await this.normalize(url);
                        contents = contents.replace(value, 'require("' + url + '"');
                    } else {
                        util.error(vinyl.path);
                        util.error(reqUrl + '别名依赖未找到！');
                    }
                }
            }
            vinyl.contents = new Buffer(contents);
            return vinyl;
        } catch (e) {
            console.log(e);
        }
    }





    isload = false
    npmConfig = require(process.cwd() + '/package.json')
    /**
     * 加载npm配置
     */
    npmLoad(): Promise<void> {
        return new Promise<any>((resolve) => {
            if (!this.isload) {
                npm.load(this.npmConfig, (err?: Error, result?: any) => {
                    this.isload = true;
                    resolve();
                })
            } else {
                resolve();
            }
        })
    }

    /**
     * promise包裹回调
     * @param fun
     * @param args 命令参数
     */
    cmd(fun, args: string[], show = true): Promise<any> {
        return new Promise<any>((resolve) => {
            this.npmLoad().then(() => {
                npm.commands[fun](args, show, (err?: Error, result?: any) => {
                    resolve(result);
                })
            })
        })
    }

    /**
    * 记录nodejs模块依赖列表
    * @param  模块名称
    */
    dependencies: Dependencies
    /**
    * 获取nodejs依赖列表
    * @param  模块名称
    */
    async ls(name: string = null): Promise<Dependencies> {
        try {
            await this.npmLoad();
            if (!this.dependencies) {
                npm.config.set('json', 'true');
                npm.config.set('long', 'true');
                let obj = await this.cmd('ls', name ? [name] : null);
                npm.config.set('json', null);
                npm.config.set('long', null);
                this.dependencies = obj.dependencies;
                return obj.dependencies;
            }
            return this.dependencies;
        } catch (e) {
            console.log(e);
        }
    }

}

let nodeJsDep = new NodeJsDep();
export default nodeJsDep;
