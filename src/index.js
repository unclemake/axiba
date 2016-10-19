"use strict";
const gulp = require('gulp');
const gulp_1 = require('./gulp');
const axiba_dependencies_1 = require('axiba-dependencies');
const through = require('through2');
const ph = require('path');
const sourcemaps = require('gulp-sourcemaps');
const gulpBabel = require('gulp-babel');
const gulpUglify = require('gulp-uglify');
const gulpMinifyCss = require('gulp-minify-css');
const gulpLess = require('gulp-less');
const gulpTypescript = require('gulp-typescript');
const tsconfig = require('../tsconfig.json').compilerOptions;
/**
 * 啊洗吧
 */
class Axiba {
    constructor() {
        this.fileContentArray = [];
        this.config = {
            assets: 'assets',
            assetsBulid: 'assetsBulid',
            glob: ['/**/*.less', '/**/*.ts'],
            mainPath: 'index.js',
            mainModules: ['react']
        };
        /** 流插件 列表 */
        this.loaderList = [];
        this.addGulpLoader('.less', [
                () => gulpLess(),
                () => gulpMinifyCss(),
                () => gulp_1.default.changeExtnameLoader('.less.js'),
                () => gulp_1.default.cssToJs(),
                () => gulp_1.default.addDefine()
        ]);
        this.addGulpLoader('.ts', [
            // () => {
            //     return sourcemaps.init();
            // },
                () => gulp_1.default.bulidNodeModule(),
        ]);
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
    deleted(path) {
    }
    changed(path) {
        // 扫描依赖
        let gulpStream = gulp.src(path, {
            base: this.config.assets
        }).pipe(axiba_dependencies_1.default.readWriteStream());
        this.loader(gulpStream, ph.extname(path))
            .pipe(through.obj((file, enc, callback) => {
            console.log(file.path);
            callback(null, file);
        }))
            .pipe(gulp.dest(this.config.assetsBulid));
    }
    addGulpLoader(extname, gulpLoader) {
        let loaderObj = this.loaderList.find(value => value.extname === extname);
        if (!loaderObj) {
            loaderObj = {
                extname: extname, loaderArray: []
            };
            this.loaderList.push(loaderObj);
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
    loader(gulpStream, extname) {
        this.loaderList.find(value => value.extname === extname)
            .loaderArray.forEach(value => {
            gulpStream = gulpStream.pipe(value());
        });
        return gulpStream;
    }
}
exports.Axiba = Axiba;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Axiba();

//# sourceMappingURL=index.js.map
