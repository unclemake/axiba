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
const gulp = require('gulp');
const axiba_dependencies_1 = require('axiba-dependencies');
const sourcemaps = require('gulp-sourcemaps');
const gulpLess = require('gulp-less');
const gulpTypescript = require('gulp-typescript');
const tsconfig = require(process.cwd() + '/tsconfig.json').compilerOptions;
const watch = require('gulp-watch');
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
            yield axiba_dependencies_1.default.src(`${config_1.default.assets}/**/*.*`);
            axiba_dependencies_1.default.createJsonFile();
            let gulpStream = gulp.src(`assets/pages/ajax/index.tsx`, {
                base: config_1.default.assets
            });
            yield new Promise((resolve) => {
                this.loader(gulpStream, '.tsx')
                    .pipe(gulp.dest(config_1.default.output))
                    .on('finish', () => resolve());
            });
            // for (let key in this.loaderList) {
            //     let element = this.loaderList[key];
            //     let gulpStream = gulp.src(`${config.assets}/**/*${element.extname}`, {
            //         base: config.assets
            //     });
            //     await new Promise((resolve) => {
            //         this.loader(gulpStream, element.extname)
            //             .pipe(gulp.dest(config.output))
            //             .on('finish', () => resolve());
            //     });
            // }
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
            ]);
            this.addGulpLoader(['.ts', '.tsx'], [
                // () => gulpClass.addFilePath(),
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
            this.addGulpLoader(['.js'], []);
            this.addGulpLoader(['.html', '.tpl'], [
                    () => gulp_1.default.htmlReplace(),
            ]);
            this.addGulpLoader(['.png', '.jpg', '.jpeg'], []);
            this.addGulpLoader(['.eot', '.svg', '.ttf', '.woff'], []);
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
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Compile;

//# sourceMappingURL=compile.js.map
