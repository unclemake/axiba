import gulpClass from './gulp';
import config from './config';

import * as gulp from 'gulp';
import nodeModule from 'axiba-npm-dependencies';
import { default as dep } from 'axiba-dependencies';

import * as fs from 'fs';
import * as path from 'path';

const sourcemaps = require('gulp-sourcemaps');
const gulpLess = require('gulp-less');
const gulpTypescript = require('gulp-typescript');
const tsconfig = require(process.cwd() + '/tsconfig.json').compilerOptions;
const watch = require('gulp-watch');


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
        await dep.src(`${config.assets}/**/*.*`);
        dep.createJsonFile();


        let gulpStream = gulp.src(`assets/pages/ajax/index.tsx`, {
            base: config.assets
        });

        await new Promise((resolve) => {
            this.loader(gulpStream, '.tsx')
                .pipe(gulp.dest(config.output))
                .on('finish', () => resolve());
        });

        // for (let key in this.loaderList) {
        //     let element = this.loaderList[key];

        //     let gulpStream = gulp.src(`${config.assets}/**/*${element.extname}`, {
        //         base: config.assets
        //     });

        //     await new Promise((resolve) => {
        //         this.loader(gulpStream, element.extname)
        //             .pipe(gulp.dest(config.output))
        //             .on('finish', () => resolve());
        //     });
        // }
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
        this.addGulpLoader(['.eot', '.svg', '.ttf', '.woff'], [
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

}




