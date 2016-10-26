import * as gulpUtil from 'gulp-util';
import * as gulp from 'gulp';
import * as ph from 'path';
import * as fs from 'fs';
import * as through from 'through2';
import { default as dep, DependenciesModel } from 'axiba-dependencies';
import { default as npmDep } from 'axiba-npm-dependencies';
import { TransformFunction, FlushFunction, makeLoader, getFile } from 'axiba-gulp';


export class Gulp {


    alias: { [key: string]: string } = {}
    /**
    * 生成node模块
    * @param  {} file
    * @param  {} enc 
    * @param  {} cb
    */
    bulidNodeModule() {
        return makeLoader(async function (file, enc, callback) {
            await dep.src(file.path);
            let depArray = dep.getDependenciesArr(file.path);
            depArray = depArray.filter(value => dep.isAlias(value));
            for (let key in depArray) {
                let element = depArray[key];
                let filePathArray = await npmDep.get(element);
                for (let key in filePathArray) {
                    let element = filePathArray[key];
                    this.push(await getFile(element));
                }
            }
            callback(null, file);
        })
    }

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
            var content: string = file.contents.toString();
            content = 'define("' + dep.clearPath(file.path).replace('assets/', '') + '",function(require, exports, module) {' + content + '});';
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


}
export default new Gulp();
