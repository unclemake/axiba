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
const axiba_util_1 = require('axiba-util');
const gulp = require('gulp');
const axiba_dependencies_1 = require('axiba-dependencies');
const axiba_npm_dependencies_1 = require('axiba-npm-dependencies');
const through = require('through2');
const ph = require('path');
const fs = require('fs');
const sourcemaps = require('gulp-sourcemaps');
const gulpLess = require('gulp-less');
const gulpTypescript = require('gulp-typescript');
const tsconfig = require(process.cwd() + '/tsconfig.json').compilerOptions;
const watch = require('gulp-watch');
/**
 * 啊洗吧
 *
 * @export
 * @class Axiba
 */
class CompileDev {
    /**
     * Creates an instance of Axiba.
     *
     *
     * @memberOf Axiba
     */
    constructor() {
        /**
         * 记录别名依赖用于 seajs配置写入
         *
         * @type {{ [key: string]: string }}
         * @memberOf Compile
         */
        this.dependenciesObj = {};
        /**
         * 流插件 列表
         *
         *
         * @memberOf CompileDev
         */
        this.loaderList = [];
        this.depNodeModules = [];
        this.addLoader();
    }
    /**
     * 扫描依赖
     *
     *
     * @memberOf Compile
     */
    scanDependence() {
        return __awaiter(this, void 0, void 0, function* () {
            axiba_dependencies_1.default.dependenciesArray = [];
            yield axiba_dependencies_1.default.src(`${config_1.default.assets}/**/*.*`);
            axiba_dependencies_1.default.createJsonFile();
        });
    }
    /**
     * 打包node模块
     *
     * @returns
     *
     * @memberOf CompileDev
     */
    packNodeDependencies(depArray = this.getAssetsDependencies()) {
        return __awaiter(this, void 0, void 0, function* () {
            let depArrayH = depArray.filter(value => {
                return !config_1.default.mainModules.find(path => value.indexOf(path) === 0);
            });
            let nodeArray = this.getNodeArray(depArrayH);
            axiba_util_1.default.log('打包node模块：');
            for (let key in nodeArray) {
                let value = nodeArray[key];
                let alias = '';
                if (value[0].indexOf('/') === -1) {
                    alias = value[0];
                }
                else {
                    alias = value[0].match(/.+?(?=\/)/g)[0];
                }
                axiba_util_1.default.log(alias);
                let externalsArray = depArray.filter(dep => value.indexOf(dep) === -1);
                yield this.bulidNodeModule(value, externalsArray, alias);
            }
            return nodeArray;
        });
    }
    /**
     * 生成框架文件
     *
     * @returns
     *
     * @memberOf CompileDev
     */
    buildMainFile() {
        return __awaiter(this, void 0, void 0, function* () {
            let content = '';
            content += yield axiba_npm_dependencies_1.default.getFileString('seajs');
            content += yield axiba_npm_dependencies_1.default.getFileString('seajs-css');
            content += this.getSeajsConfigString();
            content += yield axiba_npm_dependencies_1.default.getFileString('babel-polyfill');
            if (config_1.default.hotload) {
                // 添加调试脚本
                content += this.getDevFileString();
            }
            // 添加node模块
            let modules = yield axiba_npm_dependencies_1.default.getPackFileString(this.getMainNodeModules(), [], true);
            content += modules;
            this.mkdirsSync(config_1.default.bulidPath);
            fs.writeFileSync(ph.join(config_1.default.bulidPath, config_1.default.mainJsPath), content);
            return content;
        });
    }
    /**
     * 生成全部文件
     *
     *
     * @memberOf CompileDev
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
                        .pipe(gulp.dest(config_1.default.bulidPath))
                        .on('finish', () => resolve());
                });
            }
        });
    }
    /**
     * 启动监视
     *
     *
     * @memberOf CompileDev
     */
    watch() {
        watch(config_1.default.assets + '/**/*.*', (file) => __awaiter(this, void 0, void 0, function* () {
            if (this.loaderList.find(value => value.extname === ph.extname(file.path))) {
                switch (file.event) {
                    case 'add':
                        yield this.changed(file.path);
                        break;
                    case 'change':
                        yield this.changed(file.path);
                        break;
                    case 'unlink':
                        yield this.deleted(file.path);
                        break;
                }
                axiba_server_1.reload();
            }
        }));
        process.on('uncaughtException', function (err) {
            console.log('出错咯' + err);
        });
    }
    getDevFileString() {
        return axiba_server_1.getDevFileString();
    }
    /**
     * 获取项目  依赖的node模块 模块名数组
     *
     * @returns
     *
     * @memberOf Axiba
     */
    getAssetsDependencies() {
        let depSet = new Set();
        axiba_dependencies_1.default.dependenciesArray.forEach(value => {
            if (value.path.indexOf(config_1.default.assets) === 0) {
                value.dep.forEach(path => {
                    if (path.indexOf(config_1.default.assets) !== 0 && axiba_dependencies_1.default.isAlias(path)) {
                        depSet.add(path);
                    }
                });
            }
        });
        let depArray = [...depSet];
        this.depNodeModules = depArray;
        return depArray;
    }
    /**
     * 生成node文件
     *
     * @protected
     * @param {any} value
     * @param {any} externalsArray 全局的模块 不用打包
     * @param {any} alias
     *
     * @memberOf Compile
     */
    bulidNodeModule(pathArray, externalsArray, alias) {
        return __awaiter(this, void 0, void 0, function* () {
            let contents = yield axiba_npm_dependencies_1.default.getPackFileString(pathArray, externalsArray);
            let path = ph.join(config_1.default.bulidPath, 'node_modules', alias);
            this.mkdirsSync(path);
            fs.writeFileSync(ph.join(path, 'index.js'), contents);
            this.saveAlias(pathArray, axiba_dependencies_1.default.clearPath(ph.join('node_modules', alias, 'index.js')));
        });
    }
    ;
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
            let pathtmp;
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
     * 保存Alias
     *
     * @param {Array<string>} pathArray
     * @param {string} path
     *
     * @memberOf Axiba
     */
    saveAlias(pathArray, path) {
        for (let key in pathArray) {
            let element = pathArray[key];
            this.dependenciesObj[element] = path;
        }
    }
    /**
     * 根据依赖表获取所有node模块
     *
     * @param {string[]} depArray
     * @returns
     *
     * @memberOf Compile
     */
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
     * 获取所有main 需要打包的模块
     *
     * @protected
     * @returns
     *
     * @memberOf Compile
     */
    getMainNodeModules() {
        let depArray = this.getAssetsDependencies();
        depArray = depArray.filter(value => {
            return !!config_1.default.mainModules.find(path => value.indexOf(path) === 0);
        });
        return depArray;
    }
    /**
     * 生成seajsConfig 配置
     *
     * @returns
     *
     * @memberOf Compile
     */
    getSeajsConfigString() {
        return `\n\n seajs.config({ base: './${config_1.default.bulidPath}', alias: ${JSON.stringify(this.dependenciesObj)}});`;
    }
    /**
     * 根据后缀遍历添加 gulp 插件编译
     *
     * @protected
     * @param {NodeJS.ReadWriteStream} gulpStream
     * @param {string} extname
     * @returns
     *
     * @memberOf CompileDev
     */
    loader(gulpStream, extname) {
        this.loaderList.find(value => value.extname === extname)
            .loaderArray.forEach(value => {
            gulpStream = gulpStream.pipe(value());
        });
        return gulpStream;
    }
    /**
     * 文件流处理器添加
     *
     *
     * @memberOf Compile
     */
    addLoader() {
        this.addGulpLoader('.less', [
                () => gulp_1.default.ignoreLess(),
                () => gulpLess()
        ]);
        this.addGulpLoader(['.ts', '.tsx'], [
                () => sourcemaps.init(),
                () => gulpTypescript(tsconfig),
            // () => gulpClass.jsPathReplace(),
                () => gulp_1.default.addDefine(),
            // () => gulpBabel({ presets: ['es2015'] }),
            // () => gulpUglify({ mangle: false }),
                () => sourcemaps.write('./', {
                sourceRoot: '/' + config_1.default.assets
            })
        ]);
        this.addGulpLoader(['.js'], [
                () => gulp.dest(config_1.default.bulidPath)]);
        this.addGulpLoader(['.html', '.tpl'], [
                () => gulp_1.default.htmlReplace(),
        ]);
        this.addGulpLoader(['.png', '.jpg', '.jpeg'], []);
        this.addGulpLoader(['.eot', '.svg', '.ttf', '.woff'], []);
    }
    /**
     * 添加流插件
     *
     * @protected
     * @param {(string | string[])} extname
     * @param {(() => any)[]} [gulpLoader]
     * @returns
     *
     * @memberOf CompileDev
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
     * 删除方法
     *
     * @param {string} path
     *
     * @memberOf Axiba
     */
    deleted(path) {
        return __awaiter(this, void 0, void 0, function* () {
            let depObj = yield axiba_dependencies_1.default.getDependenciesByPath(path);
            if (depObj.extend['bulidFile']) {
                depObj.extend['bulidFile'].forEach(value => {
                    let path = value.replace(config_1.default.assets, config_1.default.bulidPath);
                    if (fs.existsSync(path)) {
                        fs.unlinkSync(path);
                    }
                });
            }
            // dep.delByPath(path);
        });
    }
    /**
     * 改变方法
     *
     * @param {string} path
     * @returns
     *
     * @memberOf Axiba
     */
    changed(path) {
        return __awaiter(this, void 0, void 0, function* () {
            let extname = ph.extname(path).toLowerCase();
            let pathArr = [path];
            yield axiba_dependencies_1.default.src(path);
            let depObj = yield axiba_dependencies_1.default.getDependenciesByPath(path);
            switch (extname) {
                case '.less':
                    pathArr = pathArr.concat(depObj.beDep);
                    break;
            }
            axiba_util_1.default.log(`开始编译:${pathArr}`);
            let gulpStream = gulp.src(pathArr, {
                base: config_1.default.assets
            });
            // 检查是否有node模块写入了
            let depSet = new Set();
            depObj.dep.forEach(path => {
                if (path.indexOf(config_1.default.assets) !== 0 && axiba_dependencies_1.default.isAlias(path)) {
                    depSet.add(path);
                }
            });
            let depArray = [...depSet];
            depArray = depArray.filter(value => {
                return !this.depNodeModules.find(name => name === value);
            });
            if (depArray.length > 0) {
                yield this.buildMainFile();
                yield this.packNodeDependencies();
            }
            depObj.extend['bulidFile'] = [];
            return yield new Promise((resolve) => {
                this.loader(gulpStream, ph.extname(path))
                    .pipe(through.obj((file, enc, callback) => {
                    let bl = /^_.+/g.test(ph.basename(file.path));
                    if (extname !== '.less' || (extname === '.less' && !bl)) {
                        depObj.extend['bulidFile'].push(axiba_dependencies_1.default.clearPath(file.path));
                    }
                    callback(null, file);
                }))
                    .pipe(gulp.dest(config_1.default.bulidPath))
                    .on('error', () => {
                    {
                        console.log('出错了');
                    }
                }).on('finish', () => {
                    axiba_util_1.default.log(`编译结束`);
                    resolve();
                });
            });
        });
    }
}
exports.CompileDev = CompileDev;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new CompileDev();
//# sourceMappingURL=compileDev.js.map
