/// <reference path="../../../typings/tsd.d.ts" />
"use strict";
const gulp = require('gulp');
const util = require('./util');
const through = require('through2');
var prettyTime = require('pretty-hrtime');
var chalk = require('chalk');
class umGulpPack {
    constructor() {
        this.vinylCache = {};
    }
    getVinylByUrl(glob) {
        return new Promise((resolve) => {
            let fileList = [];
            //格式化路径
            typeof glob == 'string' && (glob = util.clearPath(glob));
            if (typeof glob == 'string' && this.vinylCache[glob]) {
                resolve(this.vinylCache[glob]);
            }
            else if (typeof glob != 'string') {
                let newGlob = [];
                for (let value of glob) {
                    value = util.clearPath(value);
                    if (this.vinylCache[value]) {
                        fileList.push(this.vinylCache[value]);
                    }
                    else {
                        newGlob.push(value);
                    }
                }
                glob = newGlob;
                if (glob.length == 0) {
                    resolve(fileList);
                }
            }
            var getDep = () => {
                return through.obj((file, enc, cb) => {
                    fileList.push(file);
                    cb();
                });
            };
            gulp.src(glob).pipe(getDep()).on('finish', function () {
                if (fileList.length == 0) {
                    util.warn('以下有个文件未找到');
                    util.warn(glob);
                    return null;
                }
                if (typeof glob == 'string') {
                    resolve(fileList[0]);
                }
                else {
                    resolve(fileList);
                }
            });
        });
    }
    /**
    * 根据文件数组获取 stream 流
    * @param stream 数据流数组
    */
    getStream(fileArr) {
        var file = function () {
            return through.obj(function (file, enc, cb) {
                cb();
            }, function endStream(cb) {
                for (var value of fileArr) {
                    this.push(value);
                }
                cb();
            });
        };
        return gulp.src(process.argv[1]).pipe(file());
    }
    onFinish(stream) {
        var t = this;
        if (isArray(stream)) {
            var pAll = [];
            stream.forEach(function (va, i) {
                pAll.push(t.onFinish(va));
            });
            return Promise.all(pAll);
        }
        else {
            return new Promise(function (resolve) {
                stream.on('finish', function () {
                    resolve(true);
                });
            });
        }
        function isArray(o) {
            return Object.prototype.toString.call(o) === '[object Array]';
        }
    }
}
/**
 * gulp事件包装
 */
gulp.on('task_start', function (e) {
    // TODO: batch these
    // so when 5 tasks start at once it only logs one time with all 5
    util.log('\r\n');
    util.log('开始:' + chalk.green(e.task));
});
gulp.on('task_stop', function (e) {
    var time = prettyTime(e.hrDuration);
    util.log('结束:' + chalk.green(e.task) + ' ' + time);
    util.log('\r\n');
});
let newGulp = new umGulpPack();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = newGulp;
