"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const util = require('../util');
const gulp_1 = require('../gulp');
const js_1 = require('./js');
const index_1 = require('./index');
const config = require('../config');
const npm = require('npm');
class NodeJsDep {
    constructor() {
        this.isload = false;
        this.npmConfig = require(process.cwd() + '/package.json');
    }
    /**
    * 根据模块名  依赖js文件
    * @param  模块名称
    */
    getDepByName(name) {
        return __awaiter(this, void 0, Promise, function* () {
            try {
                let dependencies = yield this.ls();
                var dep = {};
                dep[name] = dependencies[name];
                if (!dep[name]) {
                    util.error('未找到nodejs ' + name + ' 模块');
                    return new Set([]);
                }
                dependencies = dep;
                let vinylArr = yield this.getDep(dependencies);
                return vinylArr;
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    /**
    * 根据依赖列表获取所有 依赖js文件
    * @param  模块名称
    */
    getDep(dependencies) {
        return __awaiter(this, void 0, Promise, function* () {
            try {
                //获取模块启动main
                let vinylSet = new Set();
                for (let i in dependencies) {
                    let value = dependencies[i];
                    let url = value.path + '/' + (value.main || 'index.js');
                    url = yield this.normalize(url);
                    let vinyl = yield gulp_1.default.getVinylByUrl(url);
                    //获取所有依赖文件
                    let allDep = yield js_1.default.getRelativeVinyl(vinyl);
                    allDep.add(vinyl);
                    for (let vinyl of allDep.keys()) {
                        vinyl = yield this.aliasReplace(vinyl, value.dependencies);
                    }
                    vinylSet = util.concatSet(vinylSet, allDep);
                    if (value.dependencies) {
                        let dep = yield this.getDep(value.dependencies);
                        vinylSet = util.concatSet(vinylSet, dep);
                    }
                }
                return vinylSet;
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    /**
     * 规范连接 让连接指向最终js
     * @param path
     */
    normalize(url) {
        return __awaiter(this, void 0, Promise, function* () {
            var stats = yield index_1.default.fsStats(url);
            if (stats) {
                if (!stats.isFile()) {
                    url += '/index.js';
                }
            }
            else {
                var stats = yield index_1.default.fsStats(url + '.js');
                if (stats) {
                    url += '.js';
                }
            }
            return url;
        });
    }
    /**
     * 替换别名
     * @param vinyl
     * @param dependencies
     */
    aliasReplace(vinyl, dependencies) {
        return __awaiter(this, void 0, Promise, function* () {
            try {
                var contents = vinyl.contents.toString();
                let depArr = contents.match(/require\(('|").*?(?=(' | "|)\))/g);
                for (let i in depArr) {
                    // 全部dep
                    let value = depArr[i];
                    //require 头
                    let reqUrl = value.match(/('|").+('|")/)[0].replace(/("|')/g, '');
                    if (js_1.default.isAlias(reqUrl)) {
                        let dependencie;
                        let url;
                        if (config.alias[reqUrl]) {
                            url = config.alias[reqUrl];
                        }
                        else if (dependencies[reqUrl]) {
                            url = dependencies[reqUrl].path + '/' + (dependencies[reqUrl].main || 'index.js');
                        }
                        if (url) {
                            //拼接别名 url地址
                            url = util.clearPath(url);
                            url = yield this.normalize(url);
                            contents = contents.replace(value, 'require("' + url + '"');
                        }
                        else {
                            util.error(vinyl.path);
                            util.error(reqUrl + '别名依赖未找到！');
                        }
                    }
                }
                vinyl.contents = new Buffer(contents);
                return vinyl;
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    /**
     * 加载npm配置
     */
    npmLoad() {
        return new Promise((resolve) => {
            if (!this.isload) {
                npm.load(this.npmConfig, (err, result) => {
                    this.isload = true;
                    resolve();
                });
            }
            else {
                resolve();
            }
        });
    }
    /**
     * promise包裹回调
     * @param fun
     * @param args 命令参数
     */
    cmd(fun, args, show = true) {
        return new Promise((resolve) => {
            this.npmLoad().then(() => {
                npm.commands[fun](args, show, (err, result) => {
                    resolve(result);
                });
            });
        });
    }
    /**
    * 获取nodejs依赖列表
    * @param  模块名称
    */
    ls(name = null) {
        return __awaiter(this, void 0, Promise, function* () {
            try {
                yield this.npmLoad();
                if (!this.dependencies) {
                    npm.config.set('json', 'true');
                    npm.config.set('long', 'true');
                    let obj = yield this.cmd('ls', name ? [name] : null);
                    npm.config.set('json', null);
                    npm.config.set('long', null);
                    this.dependencies = obj.dependencies;
                    return obj.dependencies;
                }
                return this.dependencies;
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
exports.NodeJsDep = NodeJsDep;
let nodeJsDep = new NodeJsDep();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = nodeJsDep;
