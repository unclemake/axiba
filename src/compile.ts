import * as gulp from 'gulp';
import gulpClass from './gulp';
import config from './config';

import { default as dep, DependenciesModel } from 'axiba-dependencies';
import { default as npmDep } from 'axiba-npm-dependencies';
import * as through from 'through2';
import * as ph from 'path';
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
const tsconfig = require('../tsconfig.json').compilerOptions;
const json = require(process.cwd() + '/package.json');

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
    async bulid() {
        for (let key in this.loaderList) {
            let element = this.loaderList[key];
            let gulpStream = gulp.src(`${config.assets}/**/*${element.extname}`, {
                base: config.assets
            })

            await new Promise((resolve) => {
                this.loader(gulpStream, element.extname)
                    .pipe(gulp.dest(config.assetsBulid))
                    .on('finish', () => resolve());
            });
        }
    }

    /**
    * 生成框架文件
    */
    async makeMainFile() {
        await this.packNodeDependencies(npmDep.dependenciesObjToArr({
            "react": "^15.3.2",
            "react-dom": "^15.3.2",
            "react-redux": "^4.4.5",
            "react-router": "^3.0.0",
            "redux": "^3.6.0",
            "redux-actions": "^0.12.0",
            "redux-thunk": "^2.1.0",
            "superagent": "^2.3.0",
            "antd": "^2.1.0"
        }));
        return await new Promise((resolve) => {
            gulp.src(['node_modules/seajs/dist/sea.js', 'node_modules/seajs-css/dist/seajs-css.js'], {
                base: './'
            })
                .pipe(gulpClass.nullLoader())
                .pipe(gulpConcat(config.mainPath))
                .pipe(this.makeMainFileConCat())
                .pipe(gulp.dest(config.assets))
                .on('finish', () => {
                    resolve();
                })
        });
    }

    /**
     *  合并框架文件
     */
    private makeMainFileConCat() {
        return makeLoader((file, enc, callback) => {
            var content: string = file.contents.toString();

            content += `seajs.config({ base: './${config.assetsBulid}', alias: ${JSON.stringify(this.dependenciesObj)} });`;

            content += 'function __loaderCss(b){var a=document.createElement("style");a.type="text/css";if(a.styleSheet){a.styleSheet.cssText=b}else{a.innerHTML=b}document.getElementsByTagName("head")[0].appendChild(a)};';

            file.contents = new Buffer(content);
            callback(null, file);
        })
    }

    /**
     * 打包node所有依赖模块
     * @param  {string} name
     * @param  {string} version?
     */
    async packNodeDependencies(dependencies: {
        name: string,
        version: string,
    }[] = npmDep.dependenciesObjToArr(json.dependencies)) {
        for (let key in dependencies) {
            let ele = dependencies[key];
            if (ele.name[0] !== '@') {
                this.dependenciesObj[ele.name] = `node_modules/${ele.name}.js`;
                await this.packNodeModules(ele.name, ele.version);
            }
        }

    }

    //记录别名依赖用于 seajs配置写入
    dependenciesObj: { [key: string]: string } = {}
    /**
     * 打包node模块
     * @param  {string} name
     * @param  {string} version?
     */
    async packNodeModules(name: string, version?: string) {
        let fileArray = await npmDep.get(name, version);
        return await new Promise((resolve) => {
            gulp.src(fileArray, {
                base: config.assets
            }).pipe(gulpClass.addDefine())
                .pipe(gulpConcat(`node_modules/${name}.js`))
                .pipe((() => {
                    if (name === "superagent") {
                        return gulpUglify();
                    } else {
                        return gulpClass.nullLoader();
                    }
                })())
                .pipe(gulpClass.addAlias(name, fileArray[0]))
                .pipe(gulp.dest(config.assetsBulid))
                .on('finish', () => {
                    resolve();
                });
        });
    }

    /**
     * 监视
     */
    watch() {
        gulp.watch(config.assets + '/**/*.*', (event) => {
            if (this.loaderList.find(value => value.extname === ph.extname(event.path))) {
                switch (event.type) {
                    case 'added':
                        // this.changed(event.path);
                        break;
                    case 'changed':
                        this.changed(event.path);
                        break;
                    case 'deleted':
                        this.deleted(event.path);
                        break;
                }
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
        let gulpStream = gulp.src(path, {
            base: config.assets
        }).pipe(dep.readWriteStream(true));

        this.loader(gulpStream, ph.extname(path))
            .pipe(through.obj((file, enc, callback) => {
                callback(null, file);
            }))
            .pipe(gulp.dest(config.assetsBulid))
            .on('error', () => {
                {
                    console.log('出错了');
                }
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
