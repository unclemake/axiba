import { default as gulpClass } from './gulp';
import config from './config';
import { Compile as CompileDev } from './compileDev';
import { default as dep, DependenciesModel } from 'axiba-dependencies';
import * as gulp from 'gulp';
import * as fs from 'fs';

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


dep.addParserRegExp('.css', /@import url\(['"](.+?)['"]/g, '$1');
dep.addParserRegExp('.html', /src=['"](.+?)['"]/g, '$1');
dep.addParserRegExp('.html', /href=['"](.+?)['"]/g, '$1');
dep.addParserRegExp('.html', /seajs.use\(['"](.+?)['"]/g, '$1');


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
            () => gulpBabel({ presets: ['es2015'] }),

            // () => gulpUglify(),
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

    async md5Build(path = `${config.bulidPath}/**/*.*`) {
        await dep.src(path);
        dep.createJsonFile();

        let md5Array = [];
        dep.dependenciesArray.forEach(value => {
            if (value.path.indexOf(config.bulidPath + '/pages/') === 0) {
                md5Array.push({
                    path: value.path.replace(config.bulidPath + '/', ''),
                    md5: value.md5
                })
            }
        });

        let indexJsStr = fs.readFileSync(config.bulidPath + '/' + config.mainJsPath).toString();
        indexJsStr += `
            var __md5Array = ${JSON.stringify(md5Array)};
        `;
        fs.writeFileSync(config.bulidPath + '/' + config.mainJsPath, indexJsStr);


        // let gulpStream = gulp.src([`E:/github/axiba/assets-bulid/index.html`, `E:/github/axiba/assets-bulid/components/global/index.css`], {
        //     base: config.assets
        // })
        let gulpStream = gulp.src(`${config.bulidPath}/**/*.*`, {
            base: config.bulidPath
        }).pipe(gulpClass.md5IgnoreLess())
            .pipe(gulpClass.jsPathReplaceLoader())
            .pipe(gulpClass.delMd5FileLoader())
            .pipe(gulpClass.changeExtnameMd5Loader())
            .pipe(gulp.dest(config.bulidPath));

        gulp.src(`${config.bulidPath}/${config.mainPath}`, {
            base: config.bulidPath
        }).pipe(gulpClass.md5IgnoreLess())
            .pipe(gulpClass.jsPathReplaceLoader())
            .pipe(gulpClass.delMd5FileLoader())
            .pipe(gulp.dest(config.bulidPath));

        return gulpStream;
    }


}



export default new Compile(); 
