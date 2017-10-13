var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const gulp_1 = require("./gulp");
const config_1 = require("./config");
const main_file_1 = require("./main-file");
const gulp = require("gulp");
const axiba_dependencies_1 = require("axiba-dependencies");
const axiba_util_1 = require("axiba-util");
const axiba_server_1 = require("axiba-server");
const fs = require("fs");
const path = require("path");
const sourcemaps = require('gulp-sourcemaps');
const gulpLess = require('gulp-less');
const gulpTypescript = require('gulp-typescript');
const tsconfig = require(process.cwd() + '/tsconfig.json').compilerOptions;
tsconfig.isolatedModules = true;
const watch = require('gulp-watch');
const gulpUglify = require('gulp-uglify');
const gulpCleanCss = require('gulp-clean-css');
const rimraf = require('rimraf');
const gulpBabel = require('gulp-babel');
/**
 * 编译文件
 *
 * @export
 * @class Compile
 */
class Compile {
    constructor() {
        /**
         * 流插件列表
         *
         *
         * @memberOf Compile
         */
        this.loaderList = [];
        this.reload = true;
        this.loaderInit();
    }
    /**
     * 生成全部文件
     *
     *
     * @memberOf CompileDev
     */
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            this.reload = false;
            yield this.rimraf(config_1.default.output);
            // 生成依赖表
            yield axiba_dependencies_1.default.src(`${config_1.default.assets}/**/*.*`);
            axiba_dependencies_1.default.createJsonFile();
            let promiseAll = this.loaderList.map(value => {
                let gulpStream = gulp.src(`${config_1.default.assets}/**/*${value.extname}`, {
                    base: config_1.default.assets
                });
                return this.compileDest(gulpStream, value.extname);
            });
            let pr = yield Promise.all(promiseAll);
            this.reload = true;
            return pr;
        });
    }
    /**
     * 删除文件夹
     *
     * @param {any} path
     * @returns
     *
     * @memberOf Compile
     */
    rimraf(path) {
        return new Promise((resolve, reject) => {
            rimraf(path, [], () => {
                resolve();
            });
        });
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
    loader(gulpStream, extname) {
        this.loaderList.find(value => value.extname === extname)
            .loaderArray.forEach(value => {
            gulpStream = gulpStream.pipe(value());
        });
        return gulpStream;
    }
    /**
     * 编译输出
     *
     * @protected
     * @param {NodeJS.ReadWriteStream} gulpStream
     * @param {string} extname
     *
     * @memberOf Compile
     */
    compileDest(gulpStream, extname) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                gulp_1.default.reloadList = [];
                this.loader(gulpStream, extname)
                    .pipe(gulp_1.default.reload())
                    .pipe(gulp.dest(config_1.default.output))
                    .on('error', (e) => {
                    axiba_util_1.default.error('编译出错');
                })
                    .on('finish', () => {
                    if (this.reload) {
                        // reload 放后面会导致bug 不运行 数据流的问题
                        gulp_1.default.reloadList.forEach(value => {
                            this.reloaRun(value);
                        });
                    }
                    resolve();
                });
            });
        });
    }
    /**
     * 重加载
     *
     * @param {string} url
     *
     * @memberOf Compile
     */
    reloaRun(url) {
        let extname = path.extname(url);
        if (extname === '.js' || extname === '.css') {
            axiba_util_1.default.log('重加载：' + url);
            axiba_server_1.reload(url);
        }
    }
    /**
     * 文件处理流初始化
     *
     * @protected
     *
     * @memberOf Compile
     */
    loaderInit() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addGulpLoader('.less', [
                () => gulp_1.default.ignoreLess(),
                () => gulpLess()
                // () => gulpClass.changeExtnameLoader('.less.js', /\.css/g),
                // () => gulpMinifyCss(),
                // () => gulpClass.cssToJs(),
                // () => gulpClass.addDefine(),
            ]);
            this.addGulpLoader(['.ts', '.tsx'], [
                () => gulp_1.default.replaceLess(),
                // () => gulpClass.addFilePath(),
                () => sourcemaps.init(),
                () => gulpTypescript(tsconfig),
                // () => gulpClass.jsPathReplace(),
                () => gulp_1.default.addDefine(),
                // () => gulpBabel({ presets: ['es2015'] }),
                // () => gulpClass.test(),
                // () => gulpUglify(),
                () => sourcemaps.write('./', {
                    sourceRoot: '/' + config_1.default.assets
                })
            ]);
            this.addGulpLoader(['.js'], []);
            this.addGulpLoader(['.html', '.tpl'], [
                () => gulp_1.default.htmlReplace(),
            ]);
            this.addGulpLoader(['.png', '.jpg', '.jpeg'], []);
            this.addGulpLoader(config_1.default.loader, []);
        });
    }
    /**
     * 添加文件处理流
     *
     * @protected
     *
     * @memberOf Compile
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
     * 启动监视
     *
     *
     * @memberOf CompileDev
     */
    watch() {
        watch(config_1.default.assets + '/**/*.*', (file) => __awaiter(this, void 0, void 0, function* () {
            if (this.loaderList.find(value => value.extname === path.extname(file.path))) {
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
            }
        }));
        // 拦截nodejs 报错 不拦截会报错会停止 watch进程
        process.on('uncaughtException', function (err) {
            axiba_util_1.default.error('未知错误：' + err);
        });
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
                    let path = value.replace(config_1.default.assets, config_1.default.output);
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
    changed(ph) {
        return __awaiter(this, void 0, void 0, function* () {
            let extname = path.extname(ph).toLowerCase();
            let pathArr = [ph];
            yield axiba_dependencies_1.default.src(ph);
            let depObj = yield axiba_dependencies_1.default.getDependenciesByPath(ph);
            switch (extname) {
                case '.less':
                    depObj.beDep = depObj.beDep.filter(value => !!value.match(/.+\.less$/g));
                    // 获取less 被依赖列表 编译被依赖
                    pathArr = pathArr.concat(depObj.beDep);
                    break;
                case '.ts':
                    main_file_1.default.addDep(depObj);
                    break;
                case '.tsx':
                    main_file_1.default.addDep(depObj);
                    break;
            }
            let gulpStream = gulp.src(pathArr, {
                base: config_1.default.assets
            });
            yield this.compileDest(gulpStream, path.extname(ph));
            return pathArr;
        });
    }
}
exports.default = Compile;
class Release extends Compile {
    /**
     * 合并流程
     *
     *
     * @memberOf Compile
     */
    merge() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                gulp.src(config_1.default.merge, {
                    base: config_1.default.assets
                })
                    .pipe(gulp_1.default.merge())
                    .on('finish', () => {
                    resolve();
                });
            });
        });
    }
    /**
     *
     *
     * @protected
     *
     * @memberOf Release
     */
    loaderInit() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addGulpLoader('.less', [
                () => gulp_1.default.ignoreLess(),
                () => gulpLess(),
                () => gulpCleanCss()
            ]);
            this.addGulpLoader(['.ts', '.tsx'], [
                () => gulp_1.default.replaceLess(),
                () => gulpTypescript(tsconfig),
                () => gulpBabel({ presets: ['es2015'] }),
                () => gulp_1.default.delDebug(),
                () => gulp_1.default.addDefine()
            ]);
            this.addGulpLoader(['.js'], []);
            this.addGulpLoader(['.html', '.tpl'], [
                () => gulp_1.default.htmlReplace(),
            ]);
            this.addGulpLoader(['.png', '.jpg', '.jpeg'], []);
            this.addGulpLoader(['.eot', '.svg', '.ttf', '.woff'], []);
        });
    }
    /**
    * md5文件生成
    *
    * @param {string}
    * @returns
    *
    * @memberOf Compile
    */
    md5Build(path = `${config_1.default.output}/**/*.*`) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield axiba_dependencies_1.default.src(path);
            axiba_dependencies_1.default.createJsonFile();
            // let gulpStream = gulp.src(`${config.output}/**/*.*`, {
            let gulpStream = gulp.src(path, {
                base: config_1.default.output
            }).pipe(gulp_1.default.md5IgnoreLess())
                .pipe(gulp_1.default.jsPathReplaceLoader())
                .pipe(gulp_1.default.delMd5FileLoader())
                .pipe(gulp_1.default.changeExtnameMd5Loader())
                .pipe(gulp.dest(config_1.default.output))
                .on('finish', () => {
                resolve();
            });
        }));
    }
    mainJsMd5Build() {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise((resolve) => {
                gulp.src(config_1.default.output + '/' + config_1.default.main, { base: './' })
                    .pipe(gulpUglify()).pipe(gulp.dest('./'))
                    .on('finish', () => resolve());
            });
        });
    }
}
exports.Release = Release;
//# sourceMappingURL=compile.js.map
