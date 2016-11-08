import gulpClass from './gulp';
import config from './config';

import { getDevFileString, socket } from 'axiba-server';
import util from 'axiba-util';
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

/**
 * 啊洗吧
 * 
 * @export
 * @class Axiba
 */
export class Axiba {
    /**
     * Creates an instance of Axiba.
     * 
     * 
     * @memberOf Axiba
     */
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
            // () => gulpClass.jsPathReplace(),
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
     * 
     * 
     * @memberOf Axiba
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


    //记录别名依赖用于 seajs配置写入
    dependenciesObj: { [key: string]: string } = {}
    /**
     * 生成框架文件
     * 
     * @private
     * @returns
     * 
     * @memberOf Axiba
     */
    async buildMainFile() {
        var content: string = '';
        content += await nodeModule.getFileString('seajs');
        content += await nodeModule.getFileString('seajs-css');
        content += `\n\n seajs.config({ base: './${config.assetsBulid}', alias: ${JSON.stringify(this.dependenciesObj)}});`;
        content += await nodeModule.getFileString('babel-polyfill');

        //添加调试脚本
        content += getDevFileString();

        //添加node模块
        let depArray = this.getAssetsDependencies();
        console.log('??' + depArray);
        depArray = depArray.filter(value => {
            return !!config.mainModules.find(path => value.indexOf(path) === 0);
        });
        console.log('??' + depArray);
        let modules = await nodeModule.getPackFileString(depArray);
        content += modules;

        this.mkdirsSync(config.assetsBulid);
        fs.writeFileSync(ph.join(config.assetsBulid, config.mainJsPath), content);
        return content;
    }

    getAssetsDependencies() {
        let depSet = new Set();
        dep.dependenciesArray.forEach(value => {
            value.dep.forEach(path => {
                if (path.indexOf(config.assets) !== 0 && dep.isAlias(path)) {
                    depSet.add(path);
                }
            })
        });
        let depArray: string[] = [...depSet];
        return depArray;
    }

    /**
     * 打包node所有依赖模块
     * 
     * @returns
     * 
     * @memberOf Axiba
     */
    async packNodeDependencies() {
        let depArray = this.getAssetsDependencies();
        let depArrayH = depArray.filter(value => {
            return !config.mainModules.find(path => value.indexOf(path) === 0);
        });

        let nodeArray: Array<Array<string>> = this.getNodeArray(depArrayH);
        util.log('打包node模块：');

        for (var key in nodeArray) {
            var value = nodeArray[key];
            let alias = '';
            if (value[0].indexOf('/') === -1) {
                alias = value[0];
            } else {
                alias = value[0].match(/.+?(?=\/)/g)[0];
            }
            util.log(alias);
            let externalsArray = depArray.filter(dep => value.indexOf(dep) === -1);
            util.log(externalsArray);
            let contents = await nodeModule.getPackFileString(value, externalsArray);
            let path = ph.join(config.assetsBulid, 'node_modules', alias);
            this.mkdirsSync(path);
            fs.writeFileSync(ph.join(path, 'index.js'), contents);
            this.saveAlias(value, dep.clearPath(ph.join('node_modules', alias, 'index.js')));
        }
        return nodeArray;
    }

    /**
     * 保存Alias
     * 
     * @param {Array<string>} pathArray
     * @param {string} path
     * 
     * @memberOf Axiba
     */
    saveAlias(pathArray: Array<string>, path: string) {
        for (let key in pathArray) {
            let element = pathArray[key];
            this.dependenciesObj[element] = path;
        }
    }


    /**
     * 生成路径
     * 
     * @param {any} dirpath
     * @returns
     * 
     * @memberOf Axiba
     */
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

    /**
     * 根据依赖表获取所有node模块
     * 
     * @param {string[]} depArray
     * @returns
     * 
     * @memberOf Axiba
     */
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
     * 启动监视
     * 
     * 
     * @memberOf Axiba
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

    /**
     * 删除方法
     * 
     * @param {string} path
     * 
     * @memberOf Axiba
     */
    deleted(path: string) {

    }

    /**
     * 改变方法
     * 
     * @param {string} path
     * @returns
     * 
     * @memberOf Axiba
     */
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

    /**
     * 流插件 列表
     * 
     * 
     * @memberOf Axiba
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

    /**
     * 添加流插件
     * 
     * @param {(string | string[])} extname
     * @param {(() => any)[]} [gulpLoader]
     * @returns
     * 
     * @memberOf Axiba
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
     * 
     * @param {NodeJS.ReadWriteStream} gulpStream
     * @param {string} extname
     * @returns
     * 
     * @memberOf Axiba
     */
    private loader(gulpStream: NodeJS.ReadWriteStream, extname: string) {
        this.loaderList.find(value => value.extname === extname)
            .loaderArray.forEach(value => {
                gulpStream = gulpStream.pipe(value());
            });
        return gulpStream;
    }

}


export default new Axiba();
