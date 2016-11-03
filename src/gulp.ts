import * as gulpUtil from 'gulp-util';
import * as gulp from 'gulp';
import * as ph from 'path';
import * as fs from 'fs';
import * as through from 'through2';
import { default as dep, DependenciesModel } from 'axiba-dependencies';
import { TransformFunction, FlushFunction, makeLoader, getFile } from 'axiba-gulp';
import config from './config';


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
                    //替换后的名字
                    let url: string = matchStr;

                    str = str.replace(matchStr, self.aliasReplacePath(matchStr));

                    return str;
                });
            });

            file.contents = new Buffer(content);
            return callback(null, file);
        });
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


}
export default new Gulp();
