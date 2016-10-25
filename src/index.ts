import * as gulp from 'gulp';
import gulpClass from './gulp';
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
const json = require('../package.json');

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

    config: Config = {
        assets: 'assets',
        assetsBulid: 'assetsBulid',
        glob: ['/**/*.less', '/**/*.ts'],
        mainPath: 'index.js',
        mainModules: ['react']
    };


    constructor() {

        this.addGulpLoader('.less', [
            () => gulpLess(),
            () => gulpClass.changeExtnameLoader('.less.js', /\.css/g),
            () => gulpMinifyCss(),
            () => gulpClass.cssToJs(),
            () => gulpClass.addDefine()
        ]);

        this.addGulpLoader('.ts', [
            () => gulpClass.changeLoaderName(),
            () => sourcemaps.init({ loadMaps: true }),
            () => gulpTypescript(tsconfig),
            () => gulpBabel({ presets: ['es2015'] }),
            () => gulpClass.addDefine(),
            () => gulpUglify({ mangle: false }),
            () => sourcemaps.write('./'),
        ]);

    }


    async makeMainFile() {
        return await new Promise((resolve) => {
            gulp.src('node_modules/seajs/dist/sea.js')
                .pipe(gulpClass.changeExtnameLoader(this.config.mainPath))
                .pipe(this.makeMainFileConCat())
                .pipe(gulp.dest(this.config.assets))
                .on('finish', () => resolve());
        });
    }

    private makeMainFileConCat() {
        return makeLoader((file, enc, callback) => {
            var content: string = file.contents.toString();

            content += `seajs.config({ base: './', alias: ${JSON.stringify(this.dependenciesObj)} })`;

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

            let obj = await npmDep.getDependenciesObj(ele.name, ele.version);
            this.dependenciesObj[ele.name] = `node_modules/${ele.name}.js`;

            await this.packNodeDependencies(obj.dependencies);
            await this.packNodeModules(ele.name, ele.version);
        }

    }


    dependenciesObj: { [key: string]: string } = {}
    /**
     * 打包node模块
     * @param  {string} name
     * @param  {string} version?
     */
    async packNodeModules(name: string, version?: string) {
        let arr = await npmDep.get(name, version);

        return await new Promise((resolve) => {
            gulp.src(arr, {
                base: this.config.assets
            }).pipe(gulpClass.addDefine())
                .pipe(gulpConcat(`node_modules/${name}.js`))
                .pipe(gulp.dest(this.config.assetsBulid))
                .on('finish', () => resolve());
        });
    }

    /**
     * 启动
     */
    start() {
        let config = this.config;
        gulp.watch(config.glob.map(value => config.assets + value), (event) => {

            switch (event.type) {
                case 'added':
                    this.changed(event.path);
                    break;
                case 'changed':
                    this.changed(event.path);
                    break;
                case 'deleted':
                    this.deleted(event.path);
                    break;
            }
        });
    }

    deleted(path: string) {

    }

    changed(path: string) {
        // 扫描依赖
        let gulpStream = gulp.src(path, {
            base: this.config.assets
        }).pipe(dep.readWriteStream(true));

        this.loader(gulpStream, ph.extname(path))
            .pipe(through.obj((file, enc, callback) => {
                callback(null, file);
            }))
            .pipe(gulp.dest(this.config.assetsBulid));
    }

    /** 流插件 列表 */
    loaderList: {
        extname: string,
        loaderArray: (() => any)[]
    }[] = [];


    addGulpLoader(extname: string, gulpLoader?: (() => any)[]) {
        let loaderObj = this.loaderList.find(value => value.extname === extname);
        if (!loaderObj) {
            loaderObj = {
                extname, loaderArray: []
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
