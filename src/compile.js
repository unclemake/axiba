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
const sourcemaps = require('gulp-sourcemaps');
const gulpLess = require('gulp-less');
const gulpBabel = require('gulp-babel');
const gulpUglify = require('gulp-uglify');
const gulpConcat = require('gulp-concat');
const gulpCleanCss = require('gulp-clean-css');
const gulpTypescript = require('gulp-typescript');
const tsconfig = require(process.cwd() + '/tsconfig.json').compilerOptions;
const json = require(process.cwd() + '/package.json');
const watch = require('gulp-watch');
axiba_dependencies_1.default.addParserRegExp('.css', /@import url\(['"](.+?)['"]/g, '$1');
axiba_dependencies_1.default.addParserRegExp('.html', /src=['"](.+?)['"]/g, '$1');
axiba_dependencies_1.default.addParserRegExp('.html', /href=['"](.+?)['"]/g, '$1');
axiba_dependencies_1.default.addParserRegExp('.html', /seajs.use\(['"](.+?)['"]/g, '$1');
class Compile extends compileDev_1.Compile {
    addLoader() {
        this.addGulpLoader('.less', [
                () => gulp_1.default.ignoreLess(),
                () => gulpLess(),
                () => gulpCleanCss(),
        ]);
        this.addGulpLoader(['.ts', '.tsx'], [
                () => sourcemaps.init(),
                () => gulpTypescript(tsconfig),
                () => gulpBabel({ presets: ['es2015'] }),
            // () => gulpUglify(),
                () => gulp_1.default.addDefine(),
                () => sourcemaps.write('./', {
                sourceRoot: '/' + config_1.default.assets
            })
        ]);
        this.addGulpLoader(['.js'], []);
        this.addGulpLoader(['.html', '.tpl'], [
                () => gulp_1.default.htmlReplace()
        ]);
        this.addGulpLoader(['.png', '.jpg', '.jpeg'], []);
        this.addGulpLoader(['.eot', '.svg', '.ttf', '.woff'], []);
    }
    md5Build(path = `${config_1.default.bulidPath}/**/*.*`) {
        return __awaiter(this, void 0, void 0, function* () {
            yield axiba_dependencies_1.default.src(path);
            axiba_dependencies_1.default.createJsonFile();
            let md5Array = [];
            axiba_dependencies_1.default.dependenciesArray.forEach(value => {
                if (value.path.indexOf(config_1.default.bulidPath + '/pages/') === 0) {
                    md5Array.push({
                        path: value.path.replace(config_1.default.bulidPath + '/', ''),
                        md5: value.md5
                    });
                }
            });
            let indexJsStr = fs.readFileSync(config_1.default.bulidPath + '/' + config_1.default.mainJsPath).toString();
            indexJsStr += `
            var __md5Array = ${JSON.stringify(md5Array)};
        `;
            fs.writeFileSync(config_1.default.bulidPath + '/' + config_1.default.mainJsPath, indexJsStr);
            // let gulpStream = gulp.src([`E:/github/axiba/assets-bulid/index.html`, `E:/github/axiba/assets-bulid/components/global/index.css`], {
            //     base: config.assets
            // })
            let gulpStream = gulp.src(`${config_1.default.bulidPath}/**/*.*`, {
                base: config_1.default.bulidPath
            }).pipe(gulp_1.default.md5IgnoreLess())
                .pipe(gulp_1.default.jsPathReplaceLoader())
                .pipe(gulp_1.default.delMd5FileLoader())
                .pipe(gulp_1.default.changeExtnameMd5Loader())
                .pipe(gulp.dest(config_1.default.bulidPath));
            gulp.src(`${config_1.default.bulidPath}/${config_1.default.mainPath}`, {
                base: config_1.default.bulidPath
            }).pipe(gulp_1.default.md5IgnoreLess())
                .pipe(gulp_1.default.jsPathReplaceLoader())
                .pipe(gulp_1.default.delMd5FileLoader())
                .pipe(gulp.dest(config_1.default.bulidPath));
            return gulpStream;
        });
    }
}
exports.Compile = Compile;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Compile();
//# sourceMappingURL=compile.js.map
