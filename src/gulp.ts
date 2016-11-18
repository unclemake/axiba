import * as gulpUtil from 'gulp-util';
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
    * alias 替换
    */
    jsPathReplace() {
        let self = this;
        return makeLoader((file, enc, callback) => {
            var content: string = file.contents.toString();

            let extname = ph.extname(file.path);
            let depConfig = dep.config.find(value => value.extname === '.js');
            depConfig.parserRegExpList.forEach(value => {
                let match = parseInt(value.match.split('$')[1]);
                content = content.replace(value.regExp, function () {

                    //匹配的全部
                    let str: string = arguments[0];
                    //匹配的路径名
                    let matchStr = arguments[match];

                    return this.md5Replace(file, matchStr);
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
            newPath = ph.join(filePath, path);
        }

        if (fs.existsSync(newPath)) {
            return dep.clearPath(newPath);
        } else if (fs.existsSync(newPath + extname)) {
            return dep.clearPath(newPath);
        } else {
            return path;
        }
    }

    async md5Replace(filePath, path) {
        let newPath = this.pathJoin(filePath, path);
        let depObject = dep.dependenciesArray.find(value => value.path === newPath);
        if (depObject) {

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
