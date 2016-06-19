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
const path = require('path');
class LessDependent {
    constructor() {
        this.reg = /(@import.*\(['"])([^'"]+)(['"]\))/g;
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
    * js 文件依赖判断 是否是别名
    * @param  str 路径名称
    */
    normalize(path, dep) {
        return __awaiter(this, void 0, Promise, function* () {
            dep = Path.join(Path.dirname(path), dep);
            if (!Path.extname(dep)) {
                dep += '.less';
            }
            return dep;
        });
    }
}
var dep = new LessDependent();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = dep;
