"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const gulp = require('gulp');
const gulp_1 = require('./gulp');
const axiba_dependencies_1 = require('axiba-dependencies');
const axiba_npm_dependencies_1 = require('axiba-npm-dependencies');
const through = require('through2');
const ph = require('path');
const axiba_gulp_1 = require('axiba-gulp');
const sourcemaps = require('gulp-sourcemaps');
const gulpBabel = require('gulp-babel');
const gulpUglify = require('gulp-uglify');
const gulpConcat = require('gulp-concat');
const gulpMinifyCss = require('gulp-minify-css');
const gulpLess = require('gulp-less');
const gulpTypescript = require('gulp-typescript');
const tsconfig = require('../tsconfig.json').compilerOptions;
const json = require('../package.json');
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
        this.dependenciesObj = {};
        /** 流插件 列表 */
        this.loaderList = [];
        this.addGulpLoader('.less', [
                () => gulpLess(),
                () => gulp_1.default.changeExtnameLoader('.less.js', /\.css/g),
                () => gulpMinifyCss(),
                () => gulp_1.default.cssToJs(),
                () => gulp_1.default.addDefine()
        ]);
        this.addGulpLoader('.ts', [
                () => gulp_1.default.changeLoaderName(),
                () => sourcemaps.init({ loadMaps: true }),
                () => gulpTypescript(tsconfig),
                () => gulpBabel({ presets: ['es2015'] }),
                () => gulp_1.default.addDefine(),
                () => gulpUglify({ mangle: false }),
                () => sourcemaps.write('./'),
        ]);
    }
    makeMainFile() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve) => {
                gulp.src('node_modules/seajs/dist/sea.js')
                    .pipe(gulp_1.default.changeExtnameLoader(this.config.mainPath))
                    .pipe(this.makeMainFileConCat())
                    .pipe(gulp.dest(this.config.assets))
                    .on('finish', () => resolve());
            });
        });
    }
    makeMainFileConCat() {
        return axiba_gulp_1.makeLoader((file, enc, callback) => {
            var content = file.contents.toString();
            content += `seajs.config({ base: './', alias: ${JSON.stringify(this.dependenciesObj)} })`;
            content += 'function __loaderCss(b){var a=document.createElement("style");a.type="text/css";if(a.styleSheet){a.styleSheet.cssText=b}else{a.innerHTML=b}document.getElementsByTagName("head")[0].appendChild(a)};';
            file.contents = new Buffer(content);
            callback(null, file);
        });
    }
    /**
     * 打包node所有依赖模块
     * @param  {string} name
     * @param  {string} version?
     */
    packNodeDependencies(dependencies = axiba_npm_dependencies_1.default.dependenciesObjToArr(json.dependencies)) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let key in dependencies) {
                let ele = dependencies[key];
                let obj = yield axiba_npm_dependencies_1.default.getDependenciesObj(ele.name, ele.version);
                this.dependenciesObj[ele.name] = `node_modules/${ele.name}.js`;
                yield this.packNodeDependencies(obj.dependencies);
                yield this.packNodeModules(ele.name, ele.version);
            }
        });
    }
    /**
     * 打包node模块
     * @param  {string} name
     * @param  {string} version?
     */
    packNodeModules(name, version) {
        return __awaiter(this, void 0, void 0, function* () {
            let arr = yield axiba_npm_dependencies_1.default.get(name, version);
            return yield new Promise((resolve) => {
                gulp.src(arr, {
                    base: this.config.assets
                }).pipe(gulp_1.default.addDefine())
                    .pipe(gulpConcat(`node_modules/${name}.js`))
                    .pipe(gulp.dest(this.config.assetsBulid))
                    .on('finish', () => resolve());
            });
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
    deleted(path) {
    }
    changed(path) {
        // 扫描依赖
        let gulpStream = gulp.src(path, {
            base: this.config.assets
        }).pipe(axiba_dependencies_1.default.readWriteStream(true));
        this.loader(gulpStream, ph.extname(path))
            .pipe(through.obj((file, enc, callback) => {
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
