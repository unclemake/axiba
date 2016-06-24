"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
/**
* js 文件依赖
*/
const util = require('../util');
const path = require('path');
const config = require('../config');
const index_1 = require('./index');
class JsDependent {
    constructor() {
        this.alias = config.alias || {};
        this.reg = /((require|async)\(['"])([^'"]+)(['"]\))/g;
    }
    /**
 * 依赖获取
 * @param  contents 文件内容
 * @param  bl s
 */
    getMap(vinyl) {
        return __awaiter(this, void 0, Promise, function* () {
            let depArr = util.regexMatch(vinyl.contents.toString(), this.reg, 3);
            let url = path.normalize(vinyl.path);
            let depObj = {};
            for (var i in depArr) {
                var value = depArr[i];
                depArr[i] = util.clearPath(yield this.normalize(url, value));
                depObj[value] = depArr[i];
            }
            return {
                dep: util.clearSameByArr(depArr),
                depObj: depObj
            };
        });
    }
    /**
     * 依赖替换
     * @param vinyl
     */
    replace(vinyl) {
        return __awaiter(this, void 0, Promise, function* () {
            try {
                let contents = vinyl.contents.toString();
                let thisMap = index_1.default.getMap(vinyl.path);
                contents = contents.replace(this.reg, (word, $1, $2, $3, $4) => {
                    if (this.isAlias($3)) {
                        return word;
                    }
                    else {
                        let map = index_1.default.getMap(thisMap.depObj[$3]);
                        return $1 + index_1.default.getMd5Path($3, map.md5) + $4;
                    }
                });
                vinyl.contents = new Buffer(contents);
                return vinyl;
            }
            catch (e) {
                util.log(e);
                throw e;
            }
        });
    }
    /**
     * 依赖替换  nodejs 用的 dep 替换
     * @param vinyl
     */
    depReplace(vinyl) {
        return __awaiter(this, void 0, Promise, function* () {
            var contents = vinyl.contents.toString();
            var depArr = contents.match(/require\(('|").*?(?=(' | "|)\))/g);
            var url = path.normalize(vinyl.path);
            for (var i in depArr) {
                var value = depArr[i];
                var reqUrl = value.replace(/^require\(('|")/, '');
                var reqValue = value.replace(reqUrl, (yield this.normalize(url, path.normalize(reqUrl))));
                contents.replace(value, reqUrl);
            }
            vinyl.contents = new Buffer(contents);
            return vinyl;
        });
    }
    /**
    * 依赖获取 全部文件只有相对路径文件
    * @param  vinyl
    */
    getRelativeVinyl(vinyl, pathArr = new Set()) {
        return __awaiter(this, void 0, Promise, function* () {
            try {
                var vinylArr = new Set();
                var depArr = this.matchDep(vinyl.contents.toString());
                depArr = Array.from(yield this.ariRelativePathArr(vinyl.path, depArr));
                for (let value of depArr) {
                    if (!pathArr.has(value)) {
                        pathArr.add(value);
                        let vinyl = yield index_1.default.getVinylByUrl(value);
                        vinylArr.add(vinyl);
                        util.concatSet(vinylArr, yield this.getRelativeVinyl(vinyl, pathArr));
                    }
                }
                return vinylArr;
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    /**
     * 计算相对路径为绝对路径
     * @param path
     * @param url
     */
    ariRelativePathArr(path, url) {
        return __awaiter(this, void 0, Promise, function* () {
            var urlSet = new Set();
            for (var value of url) {
                if (this.isRelativePath(value)) {
                    urlSet.add((yield this.normalize(path, value)));
                }
            }
            return urlSet;
        });
    }
    /**
     * 搜索依赖
     * @param contents
     */
    matchDep(contents) {
        return util.regexMatch(contents, this.reg, 3);
    }
    /**
    * js 文件依赖判断 是否是别名
    * @param  str 路径名称
    */
    isAlias(url) {
        var extname = path.extname(url);
        var reg = new RegExp('^' + config.isFile + '$', 'g');
        return url.indexOf('/') == -1 && url.indexOf('\\') == -1 && !(reg.test(extname));
    }
    /**
    * js 文件依赖判断 是否是别名
    * @param  str 路径名称
    */
    isRelativePath(url) {
        return url.indexOf('.') == 0;
    }
    /**
    * 根据url 计算他的dep依赖地址
    * @param  str 路径名称
    */
    normalize(url, dep) {
        return __awaiter(this, void 0, Promise, function* () {
            if (!this.isRelativePath(dep)) {
                return dep;
            }
            ;
            dep = path.join(path.dirname(url), dep);
            var stats = yield index_1.default.fsStats(dep);
            if (stats) {
                if (!stats.isFile()) {
                    dep += '/index.js';
                }
            }
            else {
                var stats = yield index_1.default.fsStats(dep + '.js');
                if (stats) {
                    dep += '.js';
                }
            }
            return dep;
        });
    }
    /**  废弃
    * 根据别名获取路径
    * @param  alias 别名
    */
    getUrlByAlias(alias) {
        return __awaiter(this, void 0, Promise, function* () {
            var url = this.alias[alias];
            if (url) {
                return url;
            }
            else {
                url = yield this.getUrlByAliasInWebModules(alias);
                if (url) {
                    return url;
                }
                else {
                    util.warn('别名未找到：' + alias);
                    return;
                }
            }
        });
    }
    /**
    * 根据别名在webModules中获取Url  废弃
    * @param  alias 别名
    */
    getUrlByAliasInWebModules(alias) {
        return __awaiter(this, void 0, void 0, function* () {
            var url = process.cwd() + '/' + config.webModules + alias + '/index.js';
            var stats = yield index_1.default.fsStats(url);
            if (stats) {
                return url;
            }
        });
    }
}
var jsDependent = new JsDependent();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = jsDependent;
