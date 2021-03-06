﻿import * as gulpUtil from 'gulp-util';
import * as gulp from 'gulp';
import * as ph from 'path';
import * as fs from 'fs';
import * as through from 'through2';
import { default as dep, DependenciesModel } from 'axiba-dependencies';
import { TransformFunction, FlushFunction, makeLoader, getFile } from 'axiba-gulp';
import config from './config';
var applySourceMap = require('vinyl-sourcemaps-apply');

export class Gulp {


    alias: { [key: string]: string } = {}


    /**
     * 添加js的alias
     * @param  {string} alias
     * @param  {string} path
     */
    addAlias(alias: string, path: string) {
        return makeLoader(async function (file, enc, callback) {
            var content: string = file.contents.toString();
            content += `\n define("${alias}", function (require, exports, module) {var exp = require('${path}');module.exports = exp;});`;
            file.contents = new Buffer(content);
            callback(null, file);
        })
    }


    /**
      * 修改文件名流插件
      * @param  {string} extname
      * @param {stream.Transform} name loader
      */
    changeExtnameLoader(name: string, reg = /.+/g) {
        return makeLoader((file, enc, callback) => {
            file.path = file.path.replace(reg, name);
            callback(null, file);
        })
    }


    /**
       * 空loader
       */
    nullLoader() {
        return makeLoader((file, enc, callback) => {
            return callback(null, file);
        })
    }


    /**
    * css文件转js文件
    * @param  {} file
    * @param  {} enc
    * @param  {} cb
    */
    cssToJs() {
        return makeLoader((file, enc, callback) => {
            var content: string = file.contents.toString();
            content = '__loaderCss(`' + content + '`)';
            file.contents = new Buffer(content);
            return callback(null, file);
        })
    }


    /**
    * 编译文件 添加
    */
    addDefine() {
        return makeLoader((file, enc, callback) => {
            let fi: any = (file as any).sourceMap;
            fi.mappings = ";" + fi.mappings;

            var content: string = file.contents.toString();
            content = `define("${dep.clearPath(file.path).replace('assets/', '')}",function(require, exports, module) {\n${content}\n});`;
            file.contents = new Buffer(content);
            return callback(null, file);
        })
    }


    /**
    * 过滤忽略文件 文件名开始为_ 
    */
    ignoreLess() {
        return makeLoader((file, enc, callback) => {
            var bl = /^_.+/g.test(ph.basename(file.path));
            if (bl) {
                callback();
            } else {
                callback(null, file);
            }
        });
    }


    /**
     * 文件名 替换 成 md5路径
     * 
     * @returns
     * 
     * @memberOf Gulp
     */
    changeExtnameMd5Loader() {
        return makeLoader((file, enc, callback) => {
            let path = file.path;
            let depObject = dep.dependenciesArray.find(value => value.path === dep.clearPath(path));

            if (depObject.path !== `${config.bulidPath}/${config.mainPath}`) {
                let md5 = depObject.md5.match(/^.{8}/g)[0];
                file.path = this.pathAddMd5(path, md5);
            }
            callback(null, file);
        });
    }

    /**
     * 给文件名添加md5
     * 
     * @param {string} path
     * @param {string} md5
     * @returns
     * 
     * @memberOf Gulp
     */
    pathAddMd5(path: string, md5: string) {
        md5 = md5.match(/^.{8}/g)[0];
        return path.replace(/(\.[^\.]+$)/g, `-${md5}$1`);
    }


    /**
       * 过滤忽略文件 文件名开始为_ 
       */
    md5IgnoreLess() {
        return makeLoader((file, enc, callback) => {
            let path = file.path;
            path = path.replace(/-[^\-]{8}(\.[^\-]+$)/g, `$1`);
            let md5 = file.path.match(/-[^\-]{8}(\.[^\-]+$)/g);

            let depObject = dep.dependenciesArray.find(value =>
                value.path === dep.clearPath(path));
            if (!depObject) {
                return callback();
            }

            if (!fs.existsSync(path) || !md5) {
                callback(null, file);
            } else {
                callback();
            }
        });
    }

    /**
     * 删除md5文件
     * 
     * @returns
     * 
     * @memberOf Gulp
     */
    delMd5FileLoader() {
        return makeLoader((file, enc, callback) => {
            let path = file.path;
            path = path.replace(/(\.[^\.]+$)/g, `-????????$1`);
            gulp.src(path).pipe(this.delFileLoader()).on('finish', () => {
                callback(null, file);
            });
        });
    }


    /**
     * 删除文件
     * 
     * @returns
     * 
     * @memberOf Gulp
     */
    delFileLoader() {
        return makeLoader((file, enc, callback) => {
            fs.unlinkSync(file.path);
            callback();
        });
    }

    /**
     * 文件内 路径 md5 替换
     * 
     * @returns
     * 
     * @memberOf Gulp
     */
    jsPathReplaceLoader() {
        let self = this;
        return makeLoader((file, enc, callback) => {
            var content: string = file.contents.toString();

            let depObject = dep.dependenciesArray.find(value =>
                value.path === dep.clearPath(file.path));

            let match = content.match(/(define\(".+)(\..+")/g);
            if (match && match.length > 1) {
                return callback(null, file);
            }

            content = content.replace(/(define\(".+)(\..+")/g, `$1-${depObject.md5.match(/^.{8}/g)[0]}$2`);

            let extname = ph.extname(file.path);
            let depConfig = dep.config.find(value => value.extname === extname);
            depConfig.parserRegExpList.forEach(value => {
                let match = parseInt(value.match.split('$')[1]);

                content = content.replace(value.regExp, function () {
                    //匹配的全部
                    let str: string = arguments[0];
                    //匹配的路径名
                    let matchStr = arguments[match];

                    str = str.replace(matchStr, self.md5Replace(file.path, matchStr));

                    return str;
                });
            });

            file.contents = new Buffer(content);
            return callback(null, file);
        });
    }



    /**
     * ts相对路径计算
     * 
     * @param {any} path1
     * @param {any} path2
     * 
     * @memberOf Gulp
     */
    pathJoin(filePath, path) {
        let newPath = '';
        let extname = ph.extname(filePath);
        if (dep.isAlias(path)) {
            newPath = path;
        } else {
            newPath = ph.join(ph.dirname(filePath), path);
        }


        if (fs.existsSync(newPath)) {
            return dep.clearPath(newPath);
        } else if (fs.existsSync(newPath + extname)) {
            return dep.clearPath(newPath + extname);
        } else {
            return path;
        }
    }

    /**
     * 根据文件路径 依赖路径  返回md5路径
     * 
     * @param {any} filePath 文件路径
     * @param {any} path 依赖路径
     * @returns
     * 
     * @memberOf Gulp
     */
    md5Replace(filePath, path) {
        let newPath = this.pathJoin(filePath, path);
        let depObject = dep.dependenciesArray.find(value => value.path === newPath);

        if (depObject && depObject.md5) {
            let basename = ph.basename(newPath);
            let md5 = depObject.md5.match(/^.{8}/g)[0];

            let md5Basename = basename.replace(/(\.[^\.]+$)/g, `-${md5}$1`);

            return path.replace(RegExp(`${ph.basename(path)}$`, 'g'), md5Basename);
        } else {
            return path;
        }
    }

    /**
     * 根据路径获取别名
     * @param  {string} path
     */
    aliasReplacePath(path: string) {
        let alias = '';

        if (/^[^\.\/]/g.test(path)) {
            let isAlias = !path.match(/[\/\\]/g);
            //获得别名
            if (isAlias) {
                alias = path;
                path = `node_modules/${alias}/index`;
            } else {
                alias = path.match(/^.+?(?=\/)/g)[0];
                path = path.replace(alias, `node_modules/${alias}`)
            }
        }

        return path;
    }


    /**
     * html根目录路径替换
     * 
     * @returns
     * 
     * @memberOf Gulp
     */
    htmlReplace() {
        return makeLoader((file, enc, callback) => {
            var content: string = file.contents.toString();
            content = this.htmlBaseReplace(content);
            file.contents = new Buffer(content);
            return callback(null, file);
        });
    }
    htmlBaseReplace(content: string) {
        content = content.replace(/\$\{base\}/g, config.bulidPath);
        return content;
    }


}
export default new Gulp();


