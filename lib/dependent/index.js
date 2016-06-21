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
* 依赖获取
*/
const db_1 = require('../db');
const util = require('../util');
const config = require('../config');
const gulp_1 = require('../gulp');
const js_1 = require('./js');
const css_1 = require('./css');
const less_1 = require('./less');
const html_1 = require('./html');
const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const through = require('through2');
const md5 = require('md5');
/**
* 依赖
*/
class Dependent {
    constructor(str = 'dependent') {
        this.db = new db_1.default(str);
    }
    /**
    * 文件依赖生成
    * @param  path 文件路径
    * @param  clear 是否清空文件依赖 默认清空
    */
    run(glob = config.baseGlob + '**/*.*') {
        var t = this;
        var sm = gulp.src(glob)
            .pipe(this.filter())
            .pipe(this.dependent());
        return gulp_1.default.onFinish(sm).then(function () {
            return t.db.save();
        });
    }
    ;
    /**
    * 依赖获取
    */
    dependent() {
        return through.obj((file, enc, cb) => {
            try {
                this.createDep(file).then((map) => {
                    map && this.addMap(map);
                    cb();
                });
            }
            catch (e) {
                throw (e);
            }
        });
    }
    /**
    * 获取文件所有数据
    * @param url
    */
    getMap(url) {
        return this.db.select({ path: util.clearPath(url) })[0];
    }
    /**
    * 根据glob 获取文件vinyl 移动位置了
    */
    getVinylByUrl(glob) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield gulp_1.default.getVinylByUrl(glob);
        });
    }
    ;
    /**
    * 根据文件流生成获取文件依赖
    * @param  file 文件流
    * @param  bl 把路径转换为相对路径 默认为false 不替换
    */
    createDep(file) {
        return __awaiter(this, void 0, Promise, function* () {
            try {
                var t = this;
                var contents = file.contents.toString();
                var extname = path.extname(file.path).replace('.', '').toLowerCase();
                var depObj = {
                    dep: [],
                    beDep: [],
                    path: util.clearPath(file.path),
                    depObj: {},
                    md5: md5(contents)
                };
                let dep;
                switch (extname) {
                    case 'js':
                        dep = yield js_1.default.getMap(file);
                        depObj = util.extend(depObj, dep);
                        break;
                    case 'css':
                        dep = yield css_1.default.getMap(file);
                        depObj = util.extend(depObj, dep);
                        break;
                    case 'less':
                        dep = yield less_1.default.getMap(file);
                        depObj = util.extend(depObj, dep);
                        break;
                    case 'html':
                        dep = yield html_1.default.getMap(file);
                        depObj = util.extend(depObj, dep);
                        break;
                    default:
                        //dep = new Set();
                        break;
                }
                //depObj.dep = Array.from(dep);
                //检测依赖文件是否存在
                for (var i in depObj.dep) {
                    var value = depObj.dep[i];
                    depObj.dep[i] = util.clearPath(value);
                }
                return depObj;
            }
            catch (e) {
                throw (e);
            }
        });
    }
    /**
    * 过滤 过滤掉文件夹
    */
    filter(type = 'file') {
        return through.obj((file, enc, cb) => {
            switch (type) {
                case 'folder':
                    !file.contents ? cb(null, file) : cb();
                    break;
                case 'file':
                    file.contents != undefined ? cb(null, file) : cb();
                    break;
            }
        });
    }
    /**
    * 根据路径查询依赖表
    * @param path 文件地址
    */
    getDep(path, depArr = []) {
        path = util.clearPath(path);
        let data = this.db.select({ path: path })[0];
        if (!data) {
            util.warn('依赖表不存在此路径:' + path);
            return [];
        }
        let dep = data.dep;
        dep.forEach((value) => {
            if (depArr.indexOf(path) == -1) {
                dep = dep.concat(this.getDep(value, dep));
            }
        });
        dep = util.clearSameByArr(dep);
        return dep;
    }
    /**
    * 根据路径查询被依赖表
    * @param path 文件地址
    */
    getBeDep(path, beDepArr = []) {
        path = util.clearPath(path);
        let data = this.db.select({ path: path })[0];
        if (!data) {
            util.warn('依赖表不存在此路径:' + path);
            return [];
        }
        let beDep = data.beDep;
        beDep.forEach((value) => {
            if (beDepArr.indexOf(path) == -1) {
                beDep = beDep.concat(this.getBeDep(value, beDep));
            }
        });
        beDep = util.clearSameByArr(beDep);
        return beDep;
    }
    /**
    * 添加依赖到数据库
    * @param  map
    */
    addMap(map) {
        try {
            //数据
            var mapSelect = this.getMap(map.path);
            if (mapSelect) {
                mapSelect.dep && mapSelect.dep.forEach((va, i) => {
                    this.delBeDep(va, [map.path]);
                });
                //保存原有的被依赖
                map.beDep = map.beDep.concat(mapSelect.beDep);
                this.db.update(mapSelect, map);
            }
            else {
                this.db.insert(map);
            }
            map.dep && map.dep.forEach((va, i) => {
                this.addBeMap({
                    path: va,
                    beDep: [map.path]
                });
            });
        }
        catch (e) {
            throw (e);
        }
    }
    /**
  * 添加依赖到数据库
  * @param  map
  */
    delMap(path) {
        try {
            //数据
            var mapSelect = this.getMap(path);
            if (mapSelect) {
                mapSelect.dep && mapSelect.dep.forEach((va, i) => {
                    this.delBeDep(va, [mapSelect.path]);
                });
                this.db.delete(mapSelect);
            }
        }
        catch (e) {
            throw (e);
        }
    }
    /**
    * 计算 md5 路径
    * @param map
    */
    getMd5Path(paths, md5) {
        let url = path.parse(paths);
        if (md5) {
            return url.dir + '/' + url.name + '-' + md5.slice(0, 8) + url.ext;
        }
        else {
            return paths;
        }
    }
    /**
    * 添加被依赖 到数据库
    * @param map
    */
    addBeMap(map) {
        var mapSelect = this.getMap(map.path);
        let beDep = map.beDep;
        if (mapSelect) {
            beDep = mapSelect.beDep.concat(beDep);
            this.db.update(mapSelect, { beDep: beDep });
        }
        else {
            this.db.insert(map);
        }
    }
    /**
    * 清空被依赖文件 (每次添加依赖文件的时候需要删除旧的依赖文件)
    * @param  path 文件地址
    * @param  dep 文件名称
    */
    delBeDep(path, beDep) {
        var t = this;
        var map = t.db.select({ path: path })[0];
        if (map && beDep) {
            var newArr = [];
            map.beDep.forEach(function (va, i) {
                beDep.indexOf(va) == -1 && newArr.push(va);
            });
            map.beDep = newArr;
        }
    }
    /**
    * 根据绝对路径 更新值
    * @param  path 文件地址
    * @param  obj 值
    */
    update(path, obj) {
        var map = this.db.select({ path: util.clearPath(path) })[0];
        return this.db.update(map, obj);
    }
    /**
    * 获取文件状态
    */
    fsStats(path) {
        return new Promise((resolve) => {
            fs.stat(util.clearPathParameter(path), (err, stats) => {
                resolve(stats);
            });
        });
    }
}
exports.Dependent = Dependent;
var dependent = new Dependent();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = dependent;
