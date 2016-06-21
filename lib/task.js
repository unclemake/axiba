/// <reference path="../typings/tsd.d.ts" />
/// <type="system" />
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const git = require('./git');
const util = require('./util');
const index_1 = require('./dependent/index');
const config = require('./config');
const uglify = require('./uglify');
const db_1 = require('./db');
const gulp_1 = require('./gulp');
const gulp = require('gulp');
const fs = require('fs');
var stripBom = require('gulp-stripbom'); //清楚bom
var zip = require('gulp-zip'); //压缩
var through = require('through2');
class Task {
    /** 构造函数*/
    constructor() {
        var t = this;
        this.db = new db_1.default('');
        this.db.data = [
            { name: '前端监视编译', pid: '0', id: '6', task: () => t.watch() },
            { name: 'git 提交 -> 推送', pid: '0', id: '1', task: () => t.git(), confirm: true },
            { name: '自动打包 -> 发布', pid: '0', id: '2', task: () => t.pack() },
            { name: '新建项目', pid: '0', id: '5', task: () => t.init() },
            { name: '文件生成', pid: '0', id: '7', task: () => t.uglify() },
            { name: 'git操作', pid: '0', id: '3' },
            { name: '文件操作', pid: '0', id: '4' },
            { name: '添加到暂存区', pid: '3', task: () => git.add() },
            { name: '提交暂存区', pid: '3', task: () => git.commit() },
            { name: '推送', pid: '3', task: () => git.push() },
            { name: '拉取', pid: '3', task: () => git.pull() },
            {
                name: '切换分支', pid: '3', task: () => util.input('请输入分支名称！').then(name => git.checkout(name))
            },
            { name: '分支合主干', pid: '3', task: () => t.merge() },
            {
                name: '记录项目起点', pid: '3', task: () => util.input('请输入日记ID！').then(start => git.saveStartPointId(start))
            },
            { name: '生成文件依赖表', pid: '4', task: () => index_1.default.run() },
            { name: '压缩优化构建', pid: '4', task: () => uglify.uglify() },
            { name: '合并', pid: '4', task: () => uglify.concatByArr() }
        ];
    }
    /**
* 任务列表显示
* @param pid 父级别id
*/
    listShow(pid) {
        return __awaiter(this, void 0, Promise, function* () {
            try {
                var data = this.db.select({ pid: pid });
                var nameList = data.map((value) => {
                    return value.name;
                });
                nameList.push('返回');
                //显示选择列表
                let i = yield util.list('啊洗吧万岁！', nameList);
                if (data[i]) {
                    let task = data[i].task;
                    if (task) {
                        let input = true;
                        if (data[i].confirm) {
                            input = yield util.confirm('是否运行！');
                        }
                        if (input) {
                            yield this.start(task, data[i].name);
                        }
                        this.listShow(pid);
                    }
                    else {
                        this.listShow(data[i].id);
                    }
                }
                else {
                    let data = this.db.select({ id: pid })[0];
                    data && this.listShow(data.pid);
                }
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    /**
    * 分支合并主干
    */
    merge() {
        var branchName;
        return git.getBranchName()
            .then(function (name) {
            branchName = name;
            return util.input('请输入分支名！(不输入合并当前分支)');
        })
            .then(function (val) {
            if (val) {
                return git.checkout()
                    .then(function () {
                    return git.merge(val);
                });
            }
            else {
                return git.checkout()
                    .then(function () {
                    return git.merge(branchName);
                });
            }
        })
            .then(function () {
            return git.checkout(branchName);
        }, function () {
            return git.checkout(branchName);
        });
    }
    /**
     * 开始任务
     * @param {string[]} str 任务命令列表
     * @param {string} name 任务名称
     */
    start(fun, name) {
        var t = this;
        return new Promise(function (resolve) {
            if (!gulp.tasks[name]) {
                gulp.task(name, function () {
                    return fun();
                });
            }
            gulp.start(name, function () {
                resolve();
            });
        });
    }
    /**
     * git提交 -> 推送
     */
    git() {
        return git.reset()
            .then(function () {
            return git.add();
        })
            .then(function () {
            return git.diff(true);
        })
            .then(function (packArr) {
            return gulp_1.default.onFinish(gulp.src(packArr, { base: './' })
                .pipe(uglify.ignore())
                .pipe(uglify.gulpUtf8())
                .pipe(stripBom())
                .pipe(gulp.dest('./')));
        })
            .then(function () {
            return git.add();
        })
            .then(function () {
            return git.diff(true);
        })
            .then(function (packArr) {
            if (packArr.length > 0) {
                util.warn('提交列表');
                util.log(packArr);
                return git.commit();
            }
        })
            .then(function () {
            return git.pull();
        })
            .then(function () {
            return git.push();
        });
    }
    /**
     * 打包 -> 发布
     */
    pack() {
        return git.pull().then(function () {
            return git.getFileList();
        }).then(function (packArr) {
            //一位数变两位数
            var getTwo = function (str) {
                str = str.toString();
                return str.length == 1 ? "0" + str : str;
            };
            var date = new Date();
            var time = '' + date.getFullYear() + getTwo(date.getMonth() + 1) + getTwo(date.getDate()) + getTwo(date.getHours()) + getTwo(date.getMinutes());
            var gulptask = gulp.src(packArr, { base: './' })
                .pipe(zip(config.commitMsg + '-' + time + '.zip'))
                .pipe(gulp.dest(config.customPath + '/pack/'));
            return gulp_1.default.onFinish(gulptask).then(function () {
                return new Promise((resolve, reject) => {
                    fs.writeFile(config.customPath + '/pack/' + config.commitMsg + '-' + time + '.txt', '修改了 ' + packArr.length + ' 个文件\r\n' + packArr.join('\r\n'), function () {
                        util.success('文件目录:');
                        util.success(config.customPath + 'pack/' + config.commitMsg + '-' + time + '.txt' + '');
                        resolve();
                    });
                });
            });
        });
    }
    /**
     * 项目初始化
     */
    init() {
        return git.reset()
            .then(function () {
            return git.diff();
        })
            .then(function (list) {
            //判断是否有未提交的文件
            return new Promise(function (resolve, reject) {
                if (list.length > 0) {
                    util.error('分支含已修改文件');
                    util.error(list);
                    reject();
                }
                else {
                    resolve();
                }
            });
        })
            .then(function () {
            return git.checkout();
        })
            .then(function () {
            return git.pull();
        })
            .then(function () {
            function inp() {
                return util.input('请输入项目名称！')
                    .then(function (name) {
                    if (name == '') {
                        util.warn('项目名称不能为空！');
                        return inp();
                    }
                    else {
                        return name;
                    }
                    ;
                }).then(function (name) {
                    return util.confirm('确定项目名:' + name)
                        .then(function () {
                        return name;
                    }, function () {
                        return inp();
                    });
                });
            }
            return inp();
        })
            .then(function (name) {
            return git.branch(name).then(function () {
                return name;
            });
        }).then(function (name) {
            return git.checkout(name);
        })
            .then(function () {
            return git.saveStartPointId();
        })
            .then(function () {
            config.state = 1;
            return config.save();
        });
    }
    /**
    * 监视任务
    */
    watch() {
        var t = this;
        return new Promise(function () {
            uglify.watch();
        });
    }
    /**
    * 构建任务
    */
    uglify() {
        return git.getFileList().then(function (arr) {
            return uglify.uglify(arr);
        });
    }
}
var exp = new Task();
module.exports = exp;
