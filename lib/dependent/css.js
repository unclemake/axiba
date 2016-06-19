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
* less 文件依赖
*/
const util = require('../util');
const Path = require('path');
const index_1 = require('./index');
const path = require('path');
class CssDependent {
    constructor() {
        this.reg = /(url\(['"])([^'"]+)(['"]\))/g;
    }
    /**
* 依赖获取
* @param  contents 文件内容
* @param  bl s
*/
    getMap(vinyl) {
        return __awaiter(this, void 0, Promise, function* () {
            let depArr = util.regexMatch(vinyl.contents.toString(), this.reg, 2);
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
     * 规范化连接
     * @param path
     * @param dep
     */
    normalize(path, dep) {
        return __awaiter(this, void 0, Promise, function* () {
            dep = Path.join(Path.dirname(path), dep);
            return dep;
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
                contents = contents.replace(this.reg, (word) => {
                    let head = arguments[1], cont = arguments[2], footer = arguments[arguments.length];
                    let map = index_1.default.getMap(thisMap.depObj[cont]);
                    return head + index_1.default.getMd5Path(cont, map.md5) + footer;
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
}
var dep = new CssDependent();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = dep;
