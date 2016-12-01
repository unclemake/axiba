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
const compileDev_1 = require('./compileDev');
const axiba_dependencies_1 = require('axiba-dependencies');
const gulp = require('gulp');
const fs = require('fs');
const ph = require('path');
const axiba_npm_dependencies_1 = require('axiba-npm-dependencies');
const sourcemaps = require('gulp-sourcemaps');
const gulpLess = require('gulp-less');
const gulpBabel = require('gulp-babel');
const gulpUglify = require('gulp-uglify');
const gulpCleanCss = require('gulp-clean-css');
const gulpTypescript = require('gulp-typescript');
const tsconfig = require(process.cwd() + '/tsconfig.json').compilerOptions;
class Compile extends compileDev_1.CompileDev {
    /**
     * 生成框架文件
     *
     * @returns
     *
     * @memberOf Compile
     */
    buildMainFile() {
        return __awaiter(this, void 0, void 0, function* () {
            let content = '';
            content += yield axiba_npm_dependencies_1.default.getFileString('seajs');
            content += yield axiba_npm_dependencies_1.default.getFileString('seajs-css');
            content += yield axiba_npm_dependencies_1.default.getFileString('babel-polyfill');
            // 添加node模块
            let modules = yield axiba_npm_dependencies_1.default.getPackFileString(this.getMainNodeModules());
            content += modules;
            this.mkdirsSync(config_1.default.bulidPath);
            fs.writeFileSync(ph.join(config_1.default.bulidPath, config_1.default.mainJsPath), content);
            return content;
        });
    }
    /**
     * mainJs 文件md5生成和添加 别名md5 页面md5名
     *
     *
     * @memberOf Compile
     */
    mainJsMd5Build() {
        return __awaiter(this, void 0, void 0, function* () {
            yield axiba_dependencies_1.default.src(`${config_1.default.bulidPath}/**/*.*`);
            axiba_dependencies_1.default.createJsonFile();
            let md5Array = [];
            axiba_dependencies_1.default.dependenciesArray.forEach(value => {
                if (value.path.indexOf(config_1.default.bulidPath + '/pages/') === 0) {
                    let path = value.path.replace(config_1.default.bulidPath + '/', '');
                    md5Array.push({
                        path: path,
                        md5: gulp_1.default.pathAddMd5(path, value.md5)
                    });
                }
            });
            let indexJsStr = fs.readFileSync(config_1.default.bulidPath + '/' + config_1.default.mainJsPath).toString();
            indexJsStr += `
            var __md5Array = ${JSON.stringify(md5Array)};
        `;
            indexJsStr += this.getSeajsConfigStringMd5();
            fs.writeFileSync(config_1.default.bulidPath + '/' + config_1.default.mainJsPath, indexJsStr);
            yield new Promise((resolve) => {
                gulp.src(config_1.default.bulidPath + '/' + config_1.default.mainJsPath, { base: './' })
                    .pipe(gulpUglify()).pipe(gulp.dest('./'))
                    .on('finish', () => resolve());
            });
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
    md5Build(path = `${config_1.default.bulidPath}/**/*.*`) {
        return __awaiter(this, void 0, void 0, function* () {
            yield axiba_dependencies_1.default.src(path);
            axiba_dependencies_1.default.createJsonFile();
            let gulpStream = gulp.src(`${config_1.default.bulidPath}/**/*.*`, {
                base: config_1.default.bulidPath
            }).pipe(gulp_1.default.md5IgnoreLess())
                .pipe(gulp_1.default.jsPathReplaceLoader())
                .pipe(gulp_1.default.delMd5FileLoader())
                .pipe(gulp_1.default.changeExtnameMd5Loader())
                .pipe(gulp.dest(config_1.default.bulidPath));
            return gulpStream;
        });
    }
    addLoader() {
        this.addGulpLoader('.less', [
                () => gulp_1.default.ignoreLess(),
                () => gulpLess(),
                () => gulpCleanCss()
        ]);
        this.addGulpLoader(['.ts', '.tsx'], [
                () => gulpTypescript(tsconfig),
                () => gulpBabel({ presets: ['es2015'] }),
                () => gulpUglify(),
                () => gulp_1.default.addDefine(),
        ]);
        this.addGulpLoader(['.js'], [
                () => gulpUglify()
        ]);
        this.addGulpLoader(['.html', '.tpl'], [
                () => gulp_1.default.htmlReplace()
        ]);
        this.addGulpLoader(['.png', '.jpg', '.jpeg'], []);
        this.addGulpLoader(['.eot', '.svg', '.ttf', '.woff'], []);
    }
    /**
     * 生成seajsConfig 配置
     *
     * @protected
     * @returns
     *
     * @memberOf Compile
     */
    getSeajsConfigStringMd5() {
        let obj = {};
        for (let key in this.dependenciesObj) {
            let element = this.dependenciesObj[key];
            let depObject = axiba_dependencies_1.default.dependenciesArray.find(value => value.path === config_1.default.bulidPath + '/' + element);
            obj[key] = gulp_1.default.pathAddMd5(axiba_dependencies_1.default.clearPath(ph.join('node_modules', key, 'index.js')), depObject.md5);
        }
        return `\n\n seajs.config({ base: './${config_1.default.bulidPath}', alias: ${JSON.stringify(obj)}});`;
    }
}
exports.Compile = Compile;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Compile();
//# sourceMappingURL=compile.js.map
