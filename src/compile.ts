import gulpClass from './gulp';
import config from './config';

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
const gulpBabel = require('gulp-babel');
const gulpUglify = require('gulp-uglify');
const gulpCleanCss = require('gulp-clean-css');

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

    /**
     * 生成全部文件
     * 
     * 
     * @memberOf CompileDev
     */
    async build() {
        // 生成依赖表
        await dep.src(`${config.assets}/**/*.*`);
        dep.createJsonFile();

        let promiseAll = this.loaderList.map(value => {
            let gulpStream = gulp.src(`${config.assets}/**/*${value.extname}`, {
                base: config.assets
            });

            return this.compileDest(gulpStream, value.extname);
        })

        return await Promise.all(promiseAll);
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
            this.loader(gulpStream, extname)
                .pipe(gulpClass.reload())
                .pipe(gulp.dest(config.output))
                .on('error', (e) => {
                    util.error('编译出错');
                })
                .on('finish', () => {
                    // util.log(`编译结束`);
                    resolve();
                });
        });
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
            // () => gulpUglify({ mangle: false }),
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
        this.addGulpLoader(['.eot', '.svg', '.ttf', '.woff', '.json'], [
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
        return gulp
            .src(config.merge, {
                base: config.assets
            })
            .pipe(gulpClass.merge())
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
            () => gulpClass.addDefine(),
            // () => gulpUglify()
        ]);

        this.addGulpLoader(['.js'], [
            // () => gulpBabel({ presets: ['es2015'] }),
            () => gulpUglify()
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
    async md5Build(path = `${config.output}/**/*.*`) {
        await dep.src(path);
        dep.createJsonFile();

        let gulpStream = gulp.src(`${config.output}/**/*.*`, {
            base: config.output
        }).pipe(gulpClass.md5IgnoreLess())
            .pipe(gulpClass.jsPathReplaceLoader())
            .pipe(gulpClass.delMd5FileLoader())
            .pipe(gulpClass.changeExtnameMd5Loader())
            .pipe(gulp.dest(config.output))

        return gulpStream;
    }

    /**
    * mainJs 文件md5生成和添加 别名md5 页面md5名
    * 
    * 
    * @memberOf Compile
    */
    async mainJsMd5Build() {
        let md5Array = [];
        dep.dependenciesArray.forEach(value => {
            if (value.path.indexOf(config.output + '/pages/') === 0) {
                let path = value.path.replace(config.output + '/', '');
                md5Array.push({
                    path: path,
                    md5: gulpClass.pathAddMd5(path, value.md5)
                })
            }
        });
        let indexJsStr = fs.readFileSync(config.output + '/' + config.main).toString();
        indexJsStr += `
            var __md5Array = ${JSON.stringify(md5Array)};
        `;
        // indexJsStr += this.getSeajsConfigStringMd5();


        fs.writeFileSync(config.output + '/' + config.main, indexJsStr);

        await new Promise((resolve) => {
            gulp.src(config.output + '/' + config.main, { base: './' })
                .pipe(gulpUglify()).pipe(gulp.dest('./'))
                .on('finish', () => resolve());
        });
    }

}







