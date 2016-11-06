"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const gulp_1 = require('./gulp');
const config_1 = require('./config');
const axiba_server_1 = require('axiba-server');
const gulp = require('gulp');
const axiba_dependencies_1 = require('axiba-dependencies');
const axiba_npm_dependencies_1 = require('axiba-npm-dependencies');
const through = require('through2');
const ph = require('path');
const fs = require('fs');
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
 */
class Axiba {
    constructor() {
        this.fileContentArray = [];
        /** 流插件 列表 */
        this.loaderList = [];
        this.addGulpLoader('.less', [
                () => gulp_1.default.ignoreLess(),
                () => gulpLess(),
        ]);
        this.addGulpLoader(['.ts', '.tsx'], [
                () => gulpTypescript(tsconfig),
                () => gulp_1.default.jsPathReplace(),
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
    build() {
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
     * 扫描依赖
     *
     *
     * @memberOf Axiba
     */
    scanDependence() {
        return __awaiter(this, void 0, void 0, function* () {
            axiba_dependencies_1.default.dependenciesArray = [];
            yield axiba_dependencies_1.default.src(`${config_1.default.assets}/**/*.*`);
            axiba_dependencies_1.default.createJsonFile();
        });
    }
    /**
     * 生成框架文件
     */
    buildMainFile() {
        return __awaiter(this, void 0, void 0, function* () {
            var content = '';
            content += axiba_npm_dependencies_1.default.getFileString('sea');
            content += axiba_npm_dependencies_1.default.getFileString('seajs-css');
            content += `\n\n seajs.config({ base: './${config_1.default.assetsBulid}');`;
            content += axiba_npm_dependencies_1.default.getFileString('babel-polyfill');
            content += yield axiba_npm_dependencies_1.default.getPackFileString(config_1.default.mainModules);
            //添加调试脚本
            content += axiba_server_1.getDevFileString();
            return content;
        });
    }
    /**
     * 打包node所有依赖模块
     * @param  {string} name
     * @param  {string} version?
     */
    packNodeDependencies() {
        return __awaiter(this, void 0, void 0, function* () {
            let depSet = new Set();
            axiba_dependencies_1.default.dependenciesArray.forEach(value => {
                value.dep.forEach(path => {
                    if (path.indexOf(config_1.default.assets) !== 0 && axiba_dependencies_1.default.isAlias(path)) {
                        depSet.add(path);
                    }
                });
            });
            let depArray = [...depSet];
            let nodeArray = this.getNodeArray(depArray);
            for (var key in nodeArray) {
                var value = nodeArray[key];
                let contents = yield axiba_npm_dependencies_1.default.getPackFileString(value);
                let alias = '';
                if (value[0].indexOf('/') === -1) {
                    alias = value[0];
                }
                else {
                    alias = value[0].match(/.+?(?=\/)/g)[0];
                }
                let path = ph.join(config_1.default.assetsBulid, 'node_modules', alias);
                this.mkdirsSync(path);
                fs.writeFileSync(ph.join(path, 'index.js'), contents);
            }
            return nodeArray;
        });
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
    getNodeArray(depArray) {
        let nodeArray = [];
        depArray.forEach(path => {
            if (path.indexOf('/') === -1) {
                nodeArray.push([path]);
            }
            else {
                let alias = path.match(/.+?(?=\/)/g)[0];
                let nodeArrayGet = nodeArray.find(nodeArray => nodeArray[0].indexOf(alias) === 0);
                if (nodeArrayGet) {
                    nodeArrayGet.push(path);
                }
                else {
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
        watch(config_1.default.assets + '/**/*.*', (file) => __awaiter(this, void 0, void 0, function* () {
            if (this.loaderList.find(value => value.extname === ph.extname(file.path))) {
                switch (file.event) {
                    case 'add':
                        // this.changed(event.path);
                        break;
                    case 'change':
                        yield this.changed(file.path);
                        break;
                    case 'delete':
                        yield this.deleted(file.path);
                        break;
                }
                axiba_server_1.socket.reload();
            }
        }));
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
            let gulpStream = gulp.src(pathArr, {
                base: config_1.default.assets
            }).pipe(axiba_dependencies_1.default.readWriteStream(true));
            return yield new Promise((resolve) => {
                this.loader(gulpStream, ph.extname(path))
                    .pipe(through.obj((file, enc, callback) => {
                    callback(null, file);
                }))
                    .pipe(gulp.dest(config_1.default.assetsBulid))
                    .on('error', () => {
                    {
                        console.log('出错了');
                    }
                }).on('finish', () => {
                    resolve();
                });
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
