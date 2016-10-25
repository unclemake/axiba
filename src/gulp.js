"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const axiba_dependencies_1 = require('axiba-dependencies');
const axiba_npm_dependencies_1 = require('axiba-npm-dependencies');
const axiba_gulp_1 = require('axiba-gulp');
class Gulp {
    constructor() {
        this.alias = {};
    }
    /**
    * 生成node模块
    * @param  {} file
    * @param  {} enc
    * @param  {} cb
    */
    bulidNodeModule() {
        return axiba_gulp_1.makeLoader(function (file, enc, callback) {
            return __awaiter(this, void 0, void 0, function* () {
                yield axiba_dependencies_1.default.src(file.path);
                let depArray = axiba_dependencies_1.default.getDependenciesArr(file.path);
                depArray = depArray.filter(value => axiba_dependencies_1.default.isAlias(value));
                for (let key in depArray) {
                    let element = depArray[key];
                    let filePathArray = yield axiba_npm_dependencies_1.default.get(element);
                    for (let key in filePathArray) {
                        let element = filePathArray[key];
                        this.push(yield axiba_gulp_1.getFile(element));
                    }
                }
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
            content = '__loaderCss("' + content + '")';
            file.contents = new Buffer(content);
            return callback(null, file);
        });
    }
    /**
      * 编译文件 添加
      */
    addDefine() {
        return axiba_gulp_1.makeLoader((file, enc, callback) => {
            var content = file.contents.toString();
            content = 'define("' + axiba_dependencies_1.default.clearPath(file.path).replace('assets/', '') + '",function(require, exports, module) {' + content + '})';
            file.contents = new Buffer(content);
            return callback(null, file);
        });
    }
    changeLoaderName() {
        return axiba_gulp_1.makeLoader((file, enc, callback) => {
            var content = file.contents.toString();
            file.contents = new Buffer(content);
            return callback(null, file);
        });
    }
}
exports.Gulp = Gulp;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Gulp();

//# sourceMappingURL=gulp.js.map
