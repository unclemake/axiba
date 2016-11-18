import gulpClass from './gulp';
import config from './config';
import { Compile as CompileDev } from './compileDev';


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



export class Compile extends CompileDev {

    addLoader() {
   
        this.addGulpLoader('.less', [
            () => gulpClass.ignoreLess(),
            () => gulpLess(),
            () => gulpCleanCss(),
        ]);

        this.addGulpLoader(['.ts', '.tsx'], [
            () => sourcemaps.init(),
            () => gulpTypescript(tsconfig),
            // () => gulpClass.jsPathReplace(),
            () => gulpBabel({ presets: ['es2015'] }),
            () => gulpUglify(),
            () => gulpClass.addDefine(),
            () => sourcemaps.write('./', {
                sourceRoot: '/' + config.assets
            })
        ]);

        this.addGulpLoader(['.js'], []);

        this.addGulpLoader(['.html', '.tpl'], [
            () => gulpClass.htmlReplace()
        ]);

        this.addGulpLoader(['.png', '.jpg', '.jpeg'], []);

        this.addGulpLoader(['.eot', '.svg', '.ttf', '.woff'], []);
        
    }
}

export default new Compile(); 
