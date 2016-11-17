"use strict";
const gulp_1 = require('./gulp');
const config_1 = require('./config');
const compileDev_1 = require('./compileDev');
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
            // () => gulpClass.jsPathReplace(),
                () => gulpBabel({ presets: ['es2015'] }),
                () => gulpUglify(),
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
}
exports.Compile = Compile;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Compile();
//# sourceMappingURL=compile.js.map
