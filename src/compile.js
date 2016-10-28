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
const config_1 = require('./config');
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
const json = require(process.cwd() + '/package.json');
/**
 * 啊洗吧
 */
class Axiba {
    constructor() {
        this.fileContentArray = [];
        //记录别名依赖用于 seajs配置写入
        this.dependenciesObj = {};
        /** 流插件 列表 */
        this.loaderList = [];
        this.addGulpLoader('.less', [
                () => gulp_1.default.ignoreLess(),
                () => gulpLess(),
        ]);
        this.addGulpLoader(['.ts', '.tsx'], [
                () => gulpTypescript(tsconfig),
                () => gulp_1.default.addDefine(),
                () => sourcemaps.init(),
                () => gulpBabel({ presets: ['es2015'] }),
            // () => gulpUglify({ mangle: false }),
                () => sourcemaps.write('./', {
                sourceRoot: '/' + config_1.default.assetsBulid
            })
        ]);
        this.addGulpLoader(['.js'], []);
        this.addGulpLoader(['.html', '.tpl'], []);
        this.addGulpLoader(['.png', '.jpg', '.jpeg'], []);
        this.addGulpLoader(['.eot', '.svg', '.ttf', '.woff'], []);
    }
    /**
     * 生成全部文件
     */
    bulid() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let key in this.loaderList) {
                let element = this.loaderList[key];
                let gulpStream = gulp.src(`${config_1.default.assets}/**/*${element.extname}`, {
                    base: config_1.default.assets
                });
                yield new Promise((resolve) => {
                    this.loader(gulpStream, element.extname)
                        .pipe(gulp.dest(config_1.default.assetsBulid))
                        .on('finish', () => resolve());
                });
            }
        });
    }
    /**
    * 生成框架文件
    */
    makeMainFile() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.packNodeDependencies(axiba_npm_dependencies_1.default.dependenciesObjToArr({
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
            return yield new Promise((resolve) => {
                gulp.src(['node_modules/seajs/dist/sea.js', 'node_modules/seajs-css/dist/seajs-css.js'], {
                    base: './'
                })
                    .pipe(gulp_1.default.nullLoader())
                    .pipe(gulpConcat(config_1.default.mainPath))
                    .pipe(this.makeMainFileConCat())
                    .pipe(gulp.dest(config_1.default.assets))
                    .on('finish', () => {
                    resolve();
                });
            });
        });
    }
    /**
     *  合并框架文件
     */
    makeMainFileConCat() {
        return axiba_gulp_1.makeLoader((file, enc, callback) => {
            var content = file.contents.toString();
            content += `seajs.config({ base: './${config_1.default.assetsBulid}', alias: ${JSON.stringify(this.dependenciesObj)} });`;
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
                if (ele.name[0] !== '@') {
                    this.dependenciesObj[ele.name] = `node_modules/${ele.name}.js`;
                    yield this.packNodeModules(ele.name, ele.version);
                }
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
            let fileArray = yield axiba_npm_dependencies_1.default.get(name, version);
            return yield new Promise((resolve) => {
                gulp.src(fileArray, {
                    base: config_1.default.assets
                }).pipe(gulp_1.default.addDefine())
                    .pipe(gulpConcat(`node_modules/${name}.js`))
                    .pipe((() => {
                    if (name === "superagent") {
                        return gulpUglify();
                    }
                    else {
                        return gulp_1.default.nullLoader();
                    }
                })())
                    .pipe(gulp_1.default.addAlias(name, fileArray[0]))
                    .pipe(gulp.dest(config_1.default.assetsBulid))
                    .on('finish', () => {
                    resolve();
                });
            });
        });
    }
    /**
     * 监视
     */
    watch() {
        gulp.watch(config_1.default.assets + '/**/*.*', (event) => {
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
    deleted(path) {
    }
    changed(path) {
        return __awaiter(this, void 0, void 0, function* () {
            let extname = ph.extname(path).toLowerCase();
            let pathArr = [path];
            switch (extname) {
                case '.less':
                    let depObj = yield axiba_dependencies_1.default.getDependenciesByPath(path);
                    pathArr = pathArr.concat(depObj.beDep);
                    break;
            }
            // 扫描依赖
            let gulpStream = gulp.src(path, {
                base: config_1.default.assets
            }).pipe(axiba_dependencies_1.default.readWriteStream(true));
            this.loader(gulpStream, ph.extname(path))
                .pipe(through.obj((file, enc, callback) => {
                callback(null, file);
            }))
                .pipe(gulp.dest(config_1.default.assetsBulid))
                .on('error', () => {
                {
                    console.log('出错了');
                }
            });
        });
    }
    /**
     * 添加流插件
     * @param  {string} extname
     * @param  {(()=>any)[]} gulpLoader?
     */
    addGulpLoader(extname, gulpLoader) {
        if (typeof (extname) === 'object') {
            extname.forEach(value => this.addGulpLoader(value, gulpLoader));
            return;
        }
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

//# sourceMappingURL=compile.js.map