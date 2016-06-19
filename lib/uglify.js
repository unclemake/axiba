/// <reference path="../../../typings/tsd.d.ts" />
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
const config = require('./config');
const gulp_1 = require('./gulp');
const index_1 = require('./dependent/index');
const js_1 = require('./dependent/js');
const html_1 = require('./dependent/html');
const nodejs_1 = require('./dependent/nodejs');
const util = require('./util');
const gulp = require('gulp');
const path = require('path');
const through = require('through2');
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
var imagemin = require('../gulp/imagemin');
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
    watch() {
        var t = this;
        config.concat.forEach((value, i) => {
            gulp.watch(value.list, (event) => {
                this.concat(value.name, value.dest, value.list);
            });
        });
        gulp.watch(config.baseGlob + '/' + config.glob.ts, function (event) {
            t.ts(event.path);
        });
        return gulp.watch(config.baseGlob + '/' + config.glob.less, function (event) {
            let beDep = index_1.default.getBeDep(event.path);
            beDep.push(event.path);
            index_1.default.run(event.path);
            return gulp.src(beDep, { base: './' })
                .pipe((() => {
                return through.obj(function (file, enc, cb) {
                    var extname = path.extname(file.path).toLocaleLowerCase();
                    if (extname == '.less') {
                        cb(null, file);
                    }
                    else {
                        cb();
                    }
                });
            })())
                .pipe(t.ignore())
                .pipe(gulpLess())
                .pipe(gulp.dest('./'));
        });
    }
    ;
    /**
     * 合并
     * @param name 文件名
     * @param dest 输出路径
     * @param list 合并文件列表
     */
    concat(name, dest, list) {
        return __awaiter(this, void 0, Promise, function* () {
            try {
                let vinylList = new Set([]);
                var pathSet = new Set([]);
                function addViny(vinyl) {
                    if (!pathSet.has(util.clearPath(vinyl.path))) {
                        vinylList.add(vinyl);
                    }
                }
                for (let value of list) {
                    if (js_1.default.isAlias(value)) {
                        let vinyl = yield nodejs_1.default.getDepByName(value);
                        for (let value of vinyl.keys()) {
                            addViny(value);
                        }
                    }
                    else {
                        let vinyl = yield gulp_1.default.getVinylByUrl(value);
                        addViny(vinyl);
                    }
                }
                let fileStream = gulp_1.default.getStream(Array.from(vinylList))
                    .pipe(this.concatType())
                    .pipe(concat(name))
                    .pipe(gulp.dest(dest));
                let finish = yield gulp_1.default.onFinish(fileStream);
                return finish;
            }
            catch (e) {
                throw e;
            }
        });
    }
    /**
     * 合并--数组
     * @param arr 数组
     */
    concatByArr(arr = config.concat) {
        return __awaiter(this, void 0, Promise, function* () {
            for (let value of arr) {
                var finish = yield this.concat(value.name, value.dest, value.list);
            }
            return finish;
        });
    }
    /**
    * 合并文件 文件内容替换
    */
    concatType() {
        var alias = {};
        return through.obj((file, enc, cb) => {
            try {
                var content = file.contents.toString();
                //如果是nodejs模块
                if (file.path.indexOf('node_modules') != -1) {
                    content = 'define(function(require, exports, module) {\n' + content + '\n})';
                }
                if (/define\(.*function/.test(content) && content.indexOf('/// <type="system" />') == -1 && file.path.indexOf('seajs') == -1) {
                    content = content.replace(/define\(.*?function/, 'define("' + util.clearPath(file.path) + '",function');
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
    uglify(glob = config.baseGlob + '/**/*.?(js|css)') {
        return __awaiter(this, void 0, Promise, function* () {
            var t = this;
            try {
                yield index_1.default.run(glob);
                let all = gulp.src(glob, { base: config.baseGlob })
                    .pipe(index_1.default.filter()); //过滤文件夹
                //每次过滤文件
                let ignoreArr = [];
                let finish = gulp_1.default.onFinish.call(gulp_1.default);
                //js处理函数
                yield finish(all.pipe(t.ignoreFile(/js/i, ignoreArr))
                    .pipe(t.gulpUtf8())
                    .pipe(t.changeName())
                    .pipe(t.changeFileName())
                    .pipe(gulp.dest(config.distGlob)));
                //css 处理函数
                yield finish(all.pipe(t.ignoreFile(/css/i, ignoreArr))
                    .pipe(t.gulpUtf8())
                    .pipe(t.changeName())
                    .pipe(t.changeFileName())
                    .pipe(minifyCss())
                    .pipe(gulp.dest(config.distGlob)));
                //html 处理函数
                yield finish(all.pipe(t.ignoreFile(/html/i, ignoreArr))
                    .pipe(t.gulpUtf8())
                    .pipe(t.changeName())
                    .pipe(t.changeFileName())
                    .pipe(gulp.dest(config.distGlob)));
                //图片 处理函数
                yield finish(all.pipe(t.ignoreFile(/(jpg|png|gif|jpeg)/i, ignoreArr))
                    .pipe(imagemin({
                    callback: function (length, minsize) {
                        util.success(length + ' 个图片压缩了 ' + minsize + ' 大小');
                    }
                }))
                    .pipe(gulp.dest(config.distGlob)));
                //其他文件
                yield finish(all.pipe(t.ignoreFile(/.*/i, ignoreArr))
                    .pipe(t.changeFileName())
                    .pipe(gulp.dest(config.distGlob)));
                return;
            }
            catch (e) {
                throw e;
            }
        });
    }
    ;
    /**
    * ts解析
    * @param path 连接
    */
    ts(pathArr) {
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
    tsDefine() {
        return through.obj(function (file, enc, cb) {
            var self = this;
            var content = file.contents.toString();
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
    less(pathArr) {
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
    ignore() {
        return through.obj(function (file, enc, cb) {
            var bl = config.ignore.test(path.basename(file.path));
            if (bl) {
                cb(null, file);
            }
            else {
                cb();
            }
        });
    }
    /**
     * 根据文件extname 过滤文件
     * @param name 后缀
     * @param ignoreArr 过滤掉的文件
     */
    ignoreFile(name, ignoreArr = []) {
        return through.obj(function (file, enc, cb) {
            var extname = path.extname(file.path).replace('.', '').toLowerCase();
            extname = config.mapType[extname] || extname;
            if (name.test(extname)) {
                cb(null, file);
            }
            else {
                ignoreArr.push(file);
                cb();
            }
        });
    }
    /**
   * 修改文件内容的文件名 为hash文件名
   */
    changeName() {
        return through.obj(function (file, enc, cb) {
            try {
                var extname = path.extname(file.path).replace('.', '').toLowerCase();
                switch (extname) {
                    case 'js':
                        js_1.default.replace(file).then((file) => {
                            cb(null, file);
                        });
                        break;
                    case 'html':
                        html_1.default.replace(file).then((file) => {
                            cb(null, file);
                        });
                        break;
                    default:
                        cb(null, file);
                        break;
                }
            }
            catch (e) {
                throw e;
            }
        });
    }
    /**
    * 修改名称
    */
    changeFileName() {
        return through.obj(function (file, enc, cb) {
            try {
                let thisMap = index_1.default.getMap(file.path);
                file.path = index_1.default.getMd5Path(file.path, thisMap.md5);
                cb(null, file);
            }
            catch (e) {
                util.log(e);
                throw e;
            }
        });
    }
    /**
   * 清除utf8文件
   */
    gulpUtf8(options) {
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
                }
                catch (e) {
                    util.error(fileName + ' 修改编码失败！');
                }
            }
            this.push(file);
            cb();
        });
    }
}
var uglify = new Uglify();
module.exports = uglify;
