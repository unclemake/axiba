import gulpClass from './gulp';
import config from './config';
import mainFile from './main-file';

import * as gulp from 'gulp';
import nodeModule from 'axiba-npm-dependencies';
import { default as dep } from 'axiba-dependencies';
import util from 'axiba-util';
import * as through from 'through2';
import { getDevFileString, reload } from 'axiba-server';

import * as fs from 'fs';
import * as path from 'path';

const sourcemaps = require('gulp-sourcemaps');
const gulpLess = require('gulp-less');
const gulpTypescript = require('gulp-typescript');
const tsconfig = require(process.cwd() + '/tsconfig.json').compilerOptions;
const watch = require('gulp-watch');
const gulpUglify = require('gulp-uglify');
const gulpCleanCss = require('gulp-clean-css');
const rimraf = require('rimraf');
const gulpBabel = require('gulp-babel');

/**
 * 编译文件
 * 
 * @export
 * @class Compile
 */
export default class Compile {
    /**
     * 流插件列表
     * 
     * 
     * @memberOf Compile
     */
    loaderList: {
        /**
         * 后缀名
         * 
         * @type {string}
         */
        extname: string,
        /**
         * 流处理列表
         */
        loaderArray: (() => any)[]
    }[] = [];


    constructor() {
        this.loaderInit();
    }

    reload = true;

    /**
     * 生成全部文件
     * 
     * 
     * @memberOf CompileDev
     */
    async build() {
        this.reload = false;

        await this.rimraf(config.output);
        // 生成依赖表
        await dep.src(`${config.assets}/**/*.*`);
        dep.createJsonFile();

        let promiseAll = this.loaderList.map(value => {
            let gulpStream = gulp.src(`${config.assets}/**/*${value.extname}`, {
                base: config.assets
            });

            return this.compileDest(gulpStream, value.extname);
        })

        let pr = await Promise.all(promiseAll);

        this.reload = true;
        return pr;

    }

    /**
     * 删除文件夹
     * 
     * @param {any} path
     * @returns
     * 
     * @memberOf Compile
     */
    rimraf(path) {
        return new Promise((resolve, reject) => {
            rimraf(path, [], () => {
                resolve()
            })
        })
    }

    /**
     * 根据后缀遍历添加 gulp 插件编译
     * 
     * @protected
     * @param {NodeJS.ReadWriteStream} gulpStream
     * @param {string} extname
     * @returns
     * 
     * @memberOf Compile
     */
    protected loader(gulpStream: NodeJS.ReadWriteStream, extname: string) {
        this.loaderList.find(value => value.extname === extname)
            .loaderArray.forEach(value => {
                gulpStream = gulpStream.pipe(value());
            });
        return gulpStream;
    }


    /**
     * 编译输出
     * 
     * @protected
     * @param {NodeJS.ReadWriteStream} gulpStream
     * @param {string} extname
     * 
     * @memberOf Compile
     */
    protected async compileDest(gulpStream: NodeJS.ReadWriteStream, extname: string) {
        return new Promise((resolve, reject) => {
            gulpClass.reloadList = [];
            this.loader(gulpStream, extname)
                .pipe(gulpClass.reload())
                .pipe(gulp.dest(config.output))
                .on('error', (e) => {
                    util.error('编译出错');
                })
                .on('finish', () => {
                    if (this.reload) {
                        // reload 放后面会导致bug 不运行 迷一样的gulp
                        gulpClass.reloadList.forEach(value => {
                            this.reloaRun(value);
                        });
                    }
                    resolve();
                })
        });
    }

    /**
     * 重加载
     * 
     * @param {string} url
     * 
     * @memberOf Compile
     */
    reloaRun(url: string) {
        let extname = path.extname(url);

        if (extname === '.js' || extname === '.css') {
            util.log('重加载：' + url);
            reload(url);
        }
    }


    /**
     * 文件处理流初始化
     * 
     * @protected
     * 
     * @memberOf Compile
     */
    protected async loaderInit() {

        this.addGulpLoader('.less', [
            () => gulpClass.ignoreLess(),
            () => gulpLess()
            // () => gulpClass.changeExtnameLoader('.less.js', /\.css/g),
            // () => gulpMinifyCss(),
            // () => gulpClass.cssToJs(),
            // () => gulpClass.addDefine(),
        ]);

        this.addGulpLoader(['.ts', '.tsx'], [
            // () => gulpClass.addFilePath(),
            () => sourcemaps.init(),
            () => gulpTypescript(tsconfig),
            // () => gulpClass.jsPathReplace(),
            () => gulpClass.addDefine(),
            // () => gulpBabel({ presets: ['es2015'] }),
            // () => gulpClass.test(),
            // () => gulpUglify(),
            () => sourcemaps.write('./', {
                sourceRoot: '/' + config.assets
            })
        ]);

        this.addGulpLoader(['.js'], []);

        this.addGulpLoader(['.html', '.tpl'], [
            () => gulpClass.htmlReplace(),
        ]);
        this.addGulpLoader(['.png', '.jpg', '.jpeg'], [
        ]);
        this.addGulpLoader(config.loader, [
        ]);
    }

    /**
     * 添加文件处理流
     * 
     * @protected
     * 
     * @memberOf Compile
     */
    protected addGulpLoader(extname: string | string[], gulpLoader?: (() => any)[]) {

        if (typeof (extname) === 'object') {
            extname.forEach(value => this.addGulpLoader(value, gulpLoader))
            return;
        }

        let loaderObj = this.loaderList.find(value => value.extname === extname);
        if (!loaderObj) {
            loaderObj = {
                extname: extname as string, loaderArray: []
            };
            this.loaderList.push(loaderObj)
        }

        if (gulpLoader) {
            loaderObj.loaderArray = loaderObj.loaderArray.concat(gulpLoader);
        }
        return this;
    }


    /**
     * 启动监视
     * 
     * 
     * @memberOf CompileDev
     */
    watch() {
        watch(config.assets + '/**/*.*', async (file) => {
            if (this.loaderList.find(value => value.extname === path.extname(file.path))) {
                switch (file.event) {
                    case 'add':
                        await this.changed(file.path);
                        break;
                    case 'change':
                        await this.changed(file.path);
                        break;
                    case 'unlink':
                        await this.deleted(file.path);
                        break;
                }
            }
        });


        // 拦截nodejs 报错 不拦截会报错会停止 watch进程
        process.on('uncaughtException', function (err) {
            util.error('未知错误：' + err);
        });

    }

    /**
     * 删除方法
     * 
     * @param {string} path
     * 
     * @memberOf Axiba
     */
    protected async deleted(path: string) {
        let depObj = await dep.getDependenciesByPath(path);

        if (depObj.extend['bulidFile']) {
            (depObj.extend['bulidFile'] as string[]).forEach(value => {
                let path = value.replace(config.assets, config.output);
                if (fs.existsSync(path)) {
                    fs.unlinkSync(path);
                }
            });
        }

        // dep.delByPath(path);
    }


    /**
    * 改变方法
    * 
    * @param {string} path
    * @returns
    * 
    * @memberOf Axiba
    */
    protected async changed(ph: string) {
        let extname = path.extname(ph).toLowerCase();
        let pathArr = [ph];
        await dep.src(ph);
        let depObj = await dep.getDependenciesByPath(ph);
        switch (extname) {
            case '.less':
                // 获取less 被依赖列表 编译被依赖
                pathArr = pathArr.concat(depObj.beDep);
                break;
            case '.ts':
                mainFile.addDep(depObj);
                break;
            case '.tsx':
                mainFile.addDep(depObj);
                break;
        }
        let gulpStream = gulp.src(pathArr, {
            base: config.assets
        });
        await this.compileDest(gulpStream, path.extname(ph));

        return pathArr;
    }
}

export class Release extends Compile {

    /**
     * 合并流程
     * 
     * 
     * @memberOf Compile
     */
    async merge() {
        return new Promise((resolve, reject) => {
            gulp.src(config.merge, {
                base: config.assets
            })
                .pipe(gulpClass.merge())
                .on('finish', () => {
                    resolve()
                });
        })
    }

    /**
     * 
     * 
     * @protected
     * 
     * @memberOf Release
     */
    protected async loaderInit() {

        this.addGulpLoader('.less', [
            () => gulpClass.ignoreLess(),
            () => gulpLess(),
            () => gulpCleanCss()
        ]);

        this.addGulpLoader(['.ts', '.tsx'], [
            () => gulpTypescript(tsconfig),
            () => gulpBabel({ presets: ['es2015'] }),
            () => gulpClass.delDebug(),
            () => gulpClass.addDefine()
        ]);

        this.addGulpLoader(['.js'], [
            // () => gulpUglify()
        ]);

        this.addGulpLoader(['.html', '.tpl'], [
            () => gulpClass.htmlReplace(),
        ]);
        this.addGulpLoader(['.png', '.jpg', '.jpeg'], [
        ]);
        this.addGulpLoader(['.eot', '.svg', '.ttf', '.woff'], [
        ]);
    }


    /**
    * md5文件生成
    * 
    * @param {string}
    * @returns
    * 
    * @memberOf Compile
    */
    md5Build(path = `${config.output}/**/*.*`) {
        return new Promise(async (resolve, reject) => {
            await dep.src(path);
            dep.createJsonFile();

            // let gulpStream = gulp.src(`${config.output}/**/*.*`, {
            let gulpStream = gulp.src(path, {
                base: config.output
            }).pipe(gulpClass.md5IgnoreLess())
                .pipe(gulpClass.jsPathReplaceLoader())
                .pipe(gulpClass.delMd5FileLoader())
                .pipe(gulpClass.changeExtnameMd5Loader())
                .pipe(gulp.dest(config.output))
                .on('finish', () => {
                    resolve();
                });
        });
    }

    async mainJsMd5Build() {
        await new Promise((resolve) => {
            gulp.src(config.output + '/' + config.main, { base: './' })
                .pipe(gulpUglify()).pipe(gulp.dest('./'))
                .on('finish', () => resolve());
        });
    }
}







