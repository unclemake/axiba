import gulpClass from './gulp';
import config from './config';

import { getDevFileString, socket } from 'axiba-server';
import * as gulp from 'gulp';
import { default as dep, DependenciesModel } from 'axiba-dependencies';
import nodeModule from 'axiba-npm-dependencies';
import * as through from 'through2';
import * as ph from 'path';
import * as fs from 'fs';
import * as gulpUtil from 'gulp-util';
import * as stream from 'stream';
import { TransformFunction, FlushFunction, makeLoader, getFile } from 'axiba-gulp';
import vinyl = require('vinyl');
const sourcemaps = require('gulp-sourcemaps');
const gulpBabel = require('gulp-babel');
const gulpUglify = require('gulp-uglify');
const gulpConcat = require('gulp-concat');
const gulpMinifyCss = require('gulp-minify-css');
const gulpLess = require('gulp-less');
const gulpTypescript = require('gulp-typescript');
const tsconfig = require(process.cwd() + '/tsconfig.json').compilerOptions;
const json = require(process.cwd() + '/package.json');
const watch = require('gulp-watch');


interface Config {
    // 项目静态文件开发目录
    assets: string

    // 项目静态文件生成目录
    assetsBulid: string

    //gulp 扫描文件glob数组
    glob: string[]

    //框架文件路径
    mainPath: string

    //框架文件包含模块
    mainModules: string[]
}


export interface TransformFunction {
    (file: gulpUtil.File, enc, callback: (a?: null, file?: gulpUtil.File) => void): void
}


export interface FlushFunction {
    (cb: () => void): void
}


/**
 * 啊洗吧
 */
export class Axiba {

    fileContentArray: {
        path: string,
        content: string,
        callback: Function
    }[] = [];

    constructor() {

        this.addGulpLoader('.less', [
            () => gulpClass.ignoreLess(),
            () => gulpLess(),
            // () => gulpClass.changeExtnameLoader('.less.js', /\.css/g),
            // () => gulpMinifyCss(),
            // () => gulpClass.cssToJs(),
            // () => gulpClass.addDefine()
        ]);

        this.addGulpLoader(['.ts', '.tsx'], [
            () => gulpTypescript(tsconfig),
            () => gulpClass.jsPathReplace(),
            () => gulpClass.addDefine(),
            () => sourcemaps.init(),
            () => gulpBabel({ presets: ['es2015'] }),
            // () => gulpUglify({ mangle: false }),
            () => sourcemaps.write('./', {
                sourceRoot: '/' + config.assetsBulid
            })
        ]);

        this.addGulpLoader(['.js'], [
        ]);
        this.addGulpLoader(['.html', '.tpl'], []);
        this.addGulpLoader(['.png', '.jpg', '.jpeg'], []);
        this.addGulpLoader(['.eot', '.svg', '.ttf', '.woff'], []);
    }

    /**
     * 生成全部文件
     */
    async build() {
        for (let key in this.loaderList) {
            let element = this.loaderList[key];
            let gulpStream = gulp.src(`${config.assets}/**/*${element.extname}`, {
                base: config.assets
            });

            await new Promise((resolve) => {
                this.loader(gulpStream, element.extname)
                    .pipe(gulp.dest(config.assetsBulid))
                    .on('finish', () => resolve());
            });
        }
    }


    /**
     * 扫描依赖
     * 
     * 
     * @memberOf Axiba
     */
    async scanDependence() {
        dep.dependenciesArray = [];
        await dep.src(`${config.assets}/**/*.*`);
        dep.createJsonFile();
    }


    /**
     * 生成框架文件
     */
    private async buildMainFile() {
        var content: string = '';
        content += nodeModule.getFileString('sea');
        content += nodeModule.getFileString('seajs-css');
        content += `\n\n seajs.config({ base: './${config.assetsBulid}');`;
        content += nodeModule.getFileString('babel-polyfill');
        content += await nodeModule.getPackFileString(config.mainModules);
        //添加调试脚本
        content += getDevFileString();

        return content;
    }


    /**
     * 打包node所有依赖模块
     * @param  {string} name
     * @param  {string} version?
     */
    async packNodeDependencies() {
        let depSet = new Set();
        dep.dependenciesArray.forEach(value => {
            value.dep.forEach(path => {
                if (path.indexOf(config.assets) !== 0 && dep.isAlias(path)) {
                    depSet.add(path);
                }
            })
        });

        let depArray = [...depSet];
        let nodeArray: Array<Array<string>> = this.getNodeArray(depArray);

        for (var key in nodeArray) {
            var value = nodeArray[key];
            let contents = await nodeModule.getPackFileString(value);
            let alias = '';
            if (value[0].indexOf('/') === -1) {
                alias = value[0];
            } else {
                alias = value[0].match(/.+?(?=\/)/g)[0];
            }

            let path = ph.join(config.assetsBulid, 'node_modules', alias);
            this.mkdirsSync(path);
            fs.writeFileSync(ph.join(path, 'index.js'), contents);
        }
        return nodeArray;
    }


    mkdirsSync(dirpath) {
        if (!fs.existsSync(dirpath)) {
            var pathtmp;
            dirpath.split(ph.sep).forEach(function (dirname) {
                if (pathtmp) {
                    pathtmp = ph.join(pathtmp, dirname);
                }
                else {
                    pathtmp = dirname;
                }
                if (!fs.existsSync(pathtmp)) {
                    if (!fs.mkdirSync(pathtmp)) {
                        return false;
                    }
                }
            });
        }
        return true;
    }
    getNodeArray(depArray: string[]) {
        let nodeArray: Array<Array<string>> = [];
        depArray.forEach(path => {
            if (path.indexOf('/') === -1) {
                nodeArray.push([path])
            } else {
                let alias = path.match(/.+?(?=\/)/g)[0];
                let nodeArrayGet = nodeArray.find(nodeArray => nodeArray[0].indexOf(alias) === 0);
                if (nodeArrayGet) {
                    nodeArrayGet.push(path);
                } else {
                    nodeArray.push([path]);
                }
            }
        });
        return nodeArray;
    }


    /**
     * 监视
     */
    watch() {
        watch(config.assets + '/**/*.*', async (file) => {
            if (this.loaderList.find(value => value.extname === ph.extname(file.path))) {
                switch (file.event) {
                    case 'add':
                        // this.changed(event.path);
                        break;
                    case 'change':
                        await this.changed(file.path);
                        break;
                    case 'delete':
                        await this.deleted(file.path);
                        break;
                }
                socket.reload();
            }
        });

        process.on('uncaughtException', function (err) {
            console.log('出错咯' + err);
        });
    }

    deleted(path: string) {

    }

    async changed(path: string) {
        let extname = ph.extname(path).toLowerCase();
        let pathArr = [path];

        switch (extname) {
            case '.less':
                let depObj = await dep.getDependenciesByPath(path);
                pathArr = pathArr.concat(depObj.beDep);
                break;
        }

        // 扫描依赖
        let gulpStream = gulp.src(pathArr, {
            base: config.assets
        }).pipe(dep.readWriteStream(true));

        return await new Promise((resolve) => {
            this.loader(gulpStream, ph.extname(path))
                .pipe(through.obj((file, enc, callback) => {
                    callback(null, file);
                }))
                .pipe(gulp.dest(config.assetsBulid))
                .on('error', () => {
                    {
                        console.log('出错了');
                    }
                }).on('finish', () => {
                    resolve();
                });
        });
    }

    /** 流插件 列表 */
    loaderList: {
        extname: string,
        loaderArray: (() => any)[]
    }[] = [];

    /**
     * 添加流插件
     * @param  {string} extname
     * @param  {(()=>any)[]} gulpLoader?
     */
    addGulpLoader(extname: string | string[], gulpLoader?: (() => any)[]) {

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
     * 根据后缀遍历添加 gulp 插件编译
     * @param  {NodeJS.ReadWriteStream} gulpStream
     * @param  {string} extname
     */
    loader(gulpStream: NodeJS.ReadWriteStream, extname: string) {
        this.loaderList.find(value => value.extname === extname)
            .loaderArray.forEach(value => {
                gulpStream = gulpStream.pipe(value());
            });
        return gulpStream;
    }

}


export default new Axiba();
