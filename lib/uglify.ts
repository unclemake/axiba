/// <reference path="../typings/tsd.d.ts" />
"use strict"


import * as config from './config';
import umGulp from './gulp';
import dependent from './dependent/index';
import jsDep from './dependent/js';
import htmlDep from './dependent/html';
import nodeDep from './dependent/nodejs';
import * as util from './util';
import * as gulp from 'gulp';
import * as path from 'path';
import {Vinyl}  from 'vinyl';
import * as through from'through2';
import * as del from'del';

/**
 * 修改文件名hash
 */
var hash = require('gulp-hash');
/**
 * 压缩js
 */
var minifyCss = require('gulp-minify-css');
/**
 * 混淆
 */
//var gulpUglify = require('gulp-uglify');
/**
 * 图片压缩
 */
var imagemin = require('gulp-imagemin');
/**
 * 合并
 */
var concat = require('gulp-concat');
/**
 * less 编译
 */
var gulpLess = require('gulp-less');
/**
 * ts 编译
 */
var gulpTypescript = require('gulp-typescript');
var jschardet = require('jschardet');
var isUtf8 = require('is-utf8');
var iconv = require('iconv-lite');


class Uglify {

    /**
         * 监视  监视less 生成 concat 合并
         */
    watch(): NodeJS.EventEmitter {

        config.concat.forEach((value, i) => {
            gulp.watch(value.list, (event) => {
                if (event.type == 'changed') {
                    this.concat(value.name, value.dest, value.list);
                }
            });
        });

        gulp.watch(config.baseGlob + '/' + config.glob.ts, (event) => {
            if (event.type == 'changed') {
                this.ts(event.path);
            }
        });

        return this.watchLess();
    };


    /**
     * 监视less
     */
    watchLess() {
        return gulp.watch(config.baseGlob + '/' + config.glob.less, async (event) => {
            let list;
            let {type, path, old} = event;
            switch (event.type) {
                case 'renamed':
                    list = dependent.getBeDep(old) || [];
                    dependent.delMap(old);
                    dependent.run(path);
                    break;
                case 'changed':
                    list = dependent.getBeDep(path) || [];
                    list.push(path);
                    dependent.run(path);
                    break;
                case 'deleted':
                    list = dependent.getBeDep(path) || [];
                    dependent.delMap(path);
                    dependent.db.save();
                    return;
                case 'added':
                    dependent.run(path);
                    return;
            }

            return gulp.src(list, { base: './' })
                .pipe(this.ignore())
                .pipe(gulpLess())
                .pipe(gulp.dest('./'));


        });
    }




    /**
     * 合并
     * @param name 文件名
     * @param dest 输出路径
     * @param list 合并文件列表
     */
    async concat(name: string, dest: string, list: string[]): Promise<boolean> {
        try {
            let vinylList: Set<Vinyl> = new Set([]);

            var pathSet: Set<string> = new Set([]);
            function addViny(vinyl: Vinyl) {
                if (!pathSet.has(util.clearPath(vinyl.path))) {
                    vinylList.add(vinyl);
                }
            }
            for (let value of list) {
                if (jsDep.isAlias(value)) {
                    let vinyl = await nodeDep.getDepByName(value);
                    for (let value of vinyl.keys()) {
                        addViny(value);
                    }
                } else {
                    let vinyl = await umGulp.getVinylByUrl(value);
                    addViny(vinyl);
                }
            }

            let fileStream = umGulp.getStream(Array.from(vinylList))
                .pipe(this.concatType())
                .pipe(concat(name))
                .pipe(gulp.dest(dest));

            let finish = await umGulp.onFinish(fileStream);
            return finish;
        }
        catch (e) {
            throw e;
        }
    }

    /**
     * 合并--数组
     * @param arr 数组
     */
    async concatByArr(arr: { name: string, dest: string, list: string[] }[] = config.concat): Promise<boolean> {
        for (let value of arr) {
            var finish = await this.concat(value.name, value.dest, value.list);
        }
        return finish;
    }

    /**
    * 合并文件 文件内容替换
    */
    private concatType(): NodeJS.ReadWriteStream {
        var alias = {};
        return through.obj((file, enc, cb) => {
            try {
                var content: string = file.contents.toString();

                //如果是nodejs模块
                if (file.path.indexOf('node_modules') != -1 && file.path.indexOf('seajs') == -1) {
                    content = 'define(function(require, exports, module) {\n' + content + '\n})';
                }

                if (/define\(.*function/.test(content) && content.indexOf('/// <type="system" />') == -1 && file.path.indexOf('seajs') == -1) {
                    content = content.replace(/define\(.*?function/, 'define("' + util.clearPath(file.path) + '",function')
                }

                file.contents = new Buffer(content);
                cb(null, file);
            }
            catch (e) {
                throw e;
            }
        });

    }

    /**
    * 扫描文件构建文件  （缺陷一次性读取全部文件 需要改进）
    */
    async  uglify(glob: string | string[] = config.baseGlob + '/**/*.*'): Promise<any> {
        var t = this;
        try {
            await dependent.run(glob);

            let all = gulp.src(glob, { base: config.baseGlob })
                .pipe(dependent.filter()) //过滤文件夹

            //每次过滤文件
            let ignoreArr = [];
            //js处理函数
            let task = all.pipe(t.ignoreFile(/js/i, ignoreArr))
                .pipe(t.gulpUtf8())
                .pipe(t.changeName());
            await this.finish(task);

            //css 处理函数
            all = umGulp.getStream(ignoreArr);
            ignoreArr = [];
            await this.finish(all.pipe(t.ignoreFile(/css/i, ignoreArr))
                .pipe(t.gulpUtf8())
                .pipe(t.changeName())
                .pipe(minifyCss()));

            //html 处理函数
            all = umGulp.getStream(ignoreArr);
            ignoreArr = [];
            await this.finish(all.pipe(t.ignoreFile(/html/i, ignoreArr))
                .pipe(t.gulpUtf8())
                .pipe(t.changeName()));

            //图片 处理函数
            all = umGulp.getStream(ignoreArr);
            ignoreArr = [];
            await this.finish(all.pipe(t.ignoreFile(/(jpg|png|gif|jpeg)/i, ignoreArr))
                .pipe(imagemin({
                    callback: function (length, minsize) {
                        util.success(length + ' 个图片压缩了 ' + minsize + ' 大小');
                    }
                })));

            all = umGulp.getStream(ignoreArr);
            //其他文件
            await this.finish(all);

            return '完成';

        }
        catch (e) {
            throw e;
        }
    };

    /**
     * 扫描文件构建文件 通用
     * @param task
     */
    private finish(task: NodeJS.ReadWriteStream) {
        try {
            let taskStream = task.pipe(this.changeFileName())
                .pipe(this.delOldFile())
                .pipe(gulp.dest(config.distGlob));
            return umGulp.onFinish(taskStream)
        }
        catch (e) {
            throw e;
        }
    };


    /**
    * ts解析 
    * @param path 连接
    */
    ts(pathArr?: string | string[]): NodeJS.ReadWriteStream {
        var tsconfig = require(process.cwd() + '/tsconfig.json').compilerOptions;

        return gulp
            .src(pathArr || config.glob.ts, {
                base: './'
            })
            .pipe(this.ignore())
            .pipe(gulpTypescript(tsconfig))
            .pipe(this.tsDefine())
            .pipe(this.gulpUtf8(null))
            .pipe(gulp.dest('./'));
    }

    /**
    * 编译文件 添加
    */
    private tsDefine(): NodeJS.ReadWriteStream {
        return through.obj(function (file, enc, cb) {
            var self = this;
            var content: string = file.contents.toString();

            if (content.indexOf('/// <type="system" />') == -1) {
                content = 'define(function(require, exports, module) {' + content + '})';
                file.contents = new Buffer(content);
            }

            return cb(null, file);

        });
    }

    /**
    * less解析 
    * @param  path 连接
    */
    less(pathArr?: string | string[]): NodeJS.ReadWriteStream {
        return gulp
            .src(pathArr || config.glob.less, {
                base: './'
            })
            .pipe(this.ignore())
            .pipe(gulpLess())
            .pipe(this.gulpUtf8(null))
            .pipe(gulp.dest('./'));
    }

    /**
    * 过滤忽略文件 文件名开始为_ 
    */
    ignore(): NodeJS.ReadWriteStream {
        return through.obj(function (file, enc, cb) {
            var bl = config.ignore.test(path.basename(file.path));

            if (bl) {
                cb(null, file);
            } else {
                cb();
            }
        });
    }


    /**
     * 根据文件extname 过滤文件 
     * @param name 后缀
     * @param ignoreArr 过滤掉的文件
     */
    ignoreFile(name: RegExp, ignoreArr: Vinyl[]): NodeJS.ReadWriteStream {
        return through.obj(function (file, enc, cb) {
            var extname = path.extname(file.path).replace('.', '').toLowerCase();
            extname = config.mapType[extname] || extname;
            if (name.test(extname)) {
                cb(null, file);
            } else {
                ignoreArr.push(file);
                cb();
            }
        });
    }


    /**
   * 修改文件内容的文件名 为hash文件名
   */
    private changeName(): NodeJS.ReadWriteStream {
        return through.obj(function (file, enc, cb) {
            try {
                var extname = path.extname(file.path).replace('.', '').toLowerCase();
                switch (extname) {
                    case 'js':
                        jsDep.replace(file).then((file) => {
                            cb(null, file);
                        });
                        break;
                    case 'html':
                        htmlDep.replace(file).then((file) => {
                            cb(null, file);
                        });
                        break;
                    default:
                        cb(null, file);
                        break;
                }
            } catch (e) {
                throw e;
            }
        });
    }

    /**
  * 删除老
  */
    private delOldFile(): NodeJS.ReadWriteStream {
        return through.obj(function (file, enc, cb) {
            try {
                let url = path.parse(util.clearPath(file.path).replace(/(-.{8})(\.[^-]+$)/g, "$2"));
                var delUrl = url.dir + '/' + url.name + '-????????' + url.ext;
                delUrl = delUrl.replace(new RegExp(config.baseGlob, 'g'), config.distGlob)

                del([delUrl]).then(paths => {
                    cb(null, file)
                });
            } catch (e) {
                throw e;
            }
        });
    }


    /**
    * 修改名称 
    */
    private changeFileName(): NodeJS.ReadWriteStream {
        return through.obj(function (file, enc, cb) {
            try {
                let thisMap = dependent.getMap(file.path);
                file.path = dependent.getMd5Path(file.path, thisMap.md5);
                cb(null, file);
            } catch (e) {
                throw e;
            }
        });
    }

    /**
    * 清除utf8文件 
    */
    gulpUtf8(options?: any): NodeJS.ReadWriteStream {
        return through.obj(function (file, enc, cb) {
            var self = this;


            options = options || {};

            if (file.isNull()) {
                this.push(file);
                return cb();
            }

            var fileName = file.path.split(path.sep).pop();
            if (file.isStream()) {
                util.error(fileName + '文件为流文件！');
                return cb();
            }

            //todo use text file detect
            var isTextFile = /^\.(js|ts|coffee|css|less|sass|html?|tpl|txt|xml|json|ejs|jade)$/.test(path.extname(fileName));

            if (isTextFile && !isUtf8(file.contents)) {
                try {
                    var encInfo = jschardet.detect(file.contents);
                    util.warn(fileName + ' 编码为 ' + encInfo.encoding + ' (已经修复)');

                    //notify
                    options.encNotMatchHandle && options.encNotMatchHandle(file.path);

                    var content = iconv.decode(file.contents, encInfo.encoding);
                    file.contents = iconv.encode(content, "utf8");
                } catch (e) {
                    util.error(fileName + ' 修改编码失败！');
                }
            }

            this.push(file);
            cb();
        });
    }

}


var uglify = new Uglify();
export = uglify;
