"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const ph = require('path');
const fs = require('fs');
const axiba_dependencies_1 = require('axiba-dependencies');
const axiba_gulp_1 = require('axiba-gulp');
const config_1 = require('./config');
var applySourceMap = require('vinyl-sourcemaps-apply');
class Gulp {
    constructor() {
        this.alias = {};
    }
    /**
     * 添加js的alias
     * @param  {string} alias
     * @param  {string} path
     */
    addAlias(alias, path) {
        return axiba_gulp_1.makeLoader(function (file, enc, callback) {
            return __awaiter(this, void 0, void 0, function* () {
                var content = file.contents.toString();
                content += `\n define("${alias}", function (require, exports, module) {var exp = require('${path}');module.exports = exp;});`;
                file.contents = new Buffer(content);
                callback(null, file);
            });
        });
    }
    /**
      * 修改文件名流插件
      * @param  {string} extname
      * @param {stream.Transform} name loader
      */
    changeExtnameLoader(name, reg = /.+/g) {
        return axiba_gulp_1.makeLoader((file, enc, callback) => {
            file.path = file.path.replace(reg, name);
            callback(null, file);
        });
    }
    /**
       * 空loader
       */
    nullLoader() {
        return axiba_gulp_1.makeLoader((file, enc, callback) => {
            return callback(null, file);
        });
    }
    /**
    * css文件转js文件
    * @param  {} file
    * @param  {} enc
    * @param  {} cb
    */
    cssToJs() {
        return axiba_gulp_1.makeLoader((file, enc, callback) => {
            var content = file.contents.toString();
            content = '__loaderCss(`' + content + '`)';
            file.contents = new Buffer(content);
            return callback(null, file);
        });
    }
    /**
    * 编译文件 添加
    */
    addDefine() {
        return axiba_gulp_1.makeLoader((file, enc, callback) => {
            let fi = file.sourceMap;
            fi.mappings = ";" + fi.mappings;
            var content = file.contents.toString();
            content = `define("${axiba_dependencies_1.default.clearPath(file.path).replace('assets/', '')}",function(require, exports, module) {\n${content}\n});`;
            file.contents = new Buffer(content);
            return callback(null, file);
        });
    }
    /**
    * 过滤忽略文件 文件名开始为_
    */
    ignoreLess() {
        return axiba_gulp_1.makeLoader((file, enc, callback) => {
            var bl = /^_.+/g.test(ph.basename(file.path));
            if (bl) {
                callback();
            }
            else {
                callback(null, file);
            }
        });
    }
    /**
    * alias 替换
    */
    jsPathReplace() {
        let self = this;
        return axiba_gulp_1.makeLoader((file, enc, callback) => {
            var content = file.contents.toString();
            let extname = ph.extname(file.path);
            let depConfig = axiba_dependencies_1.default.config.find(value => value.extname === '.js');
            depConfig.parserRegExpList.forEach(value => {
                let match = parseInt(value.match.split('$')[1]);
                content = content.replace(value.regExp, function () {
                    //匹配的全部
                    let str = arguments[0];
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
        if (axiba_dependencies_1.default.isAlias(path)) {
            newPath = path;
        }
        else {
            newPath = ph.join(filePath, path);
        }
        if (fs.existsSync(newPath)) {
            return axiba_dependencies_1.default.clearPath(newPath);
        }
        else if (fs.existsSync(newPath + extname)) {
            return axiba_dependencies_1.default.clearPath(newPath);
        }
        else {
            return path;
        }
    }
    md5Replace(filePath, path) {
        return __awaiter(this, void 0, void 0, function* () {
            let newPath = this.pathJoin(filePath, path);
            let depObject = axiba_dependencies_1.default.dependenciesArray.find(value => value.path === newPath);
            if (depObject) {
            }
            else {
                return path;
            }
        });
    }
    /**
     * 根据路径获取别名
     * @param  {string} path
     */
    aliasReplacePath(path) {
        let alias = '';
        if (/^[^\.\/]/g.test(path)) {
            let isAlias = !path.match(/[\/\\]/g);
            //获得别名
            if (isAlias) {
                alias = path;
                path = `node_modules/${alias}/index`;
            }
            else {
                alias = path.match(/^.+?(?=\/)/g)[0];
                path = path.replace(alias, `node_modules/${alias}`);
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
        return axiba_gulp_1.makeLoader((file, enc, callback) => {
            var content = file.contents.toString();
            content = this.htmlBaseReplace(content);
            file.contents = new Buffer(content);
            return callback(null, file);
        });
    }
    htmlBaseReplace(content) {
        content = content.replace(/\$\{base\}/g, config_1.default.bulidPath);
        return content;
    }
}
exports.Gulp = Gulp;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Gulp();

//# sourceMappingURL=gulp.js.map
