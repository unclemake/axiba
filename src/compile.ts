import { default as gulpClass } from './gulp';
import config from './config';
import { CompileDev } from './compileDev';
import { default as dep } from 'axiba-dependencies';
import * as gulp from 'gulp';
import * as fs from 'fs';
import * as ph from 'path';
import nodeModule from 'axiba-npm-dependencies';

const gulpLess = require('gulp-less');
const gulpBabel = require('gulp-babel');
const gulpUglify = require('gulp-uglify');
const gulpCleanCss = require('gulp-clean-css');
const gulpTypescript = require('gulp-typescript');
const tsconfig = require(process.cwd() + '/tsconfig.json').compilerOptions;



export class Compile extends CompileDev {

    /**
     * 生成框架文件
     * 
     * @returns
     * 
     * @memberOf Compile
     */
    async buildMainFile() {
        let content: string = '';
        content += await nodeModule.getFileString('seajs');
        content += await nodeModule.getFileString('seajs-css');
        content += await nodeModule.getFileString('babel-polyfill');

        // 添加node模块
        let modules = await nodeModule.getPackFileString(this.getMainNodeModules());
        content += modules;

        this.mkdirsSync(config.bulidPath);
        fs.writeFileSync(ph.join(config.bulidPath, config.mainJsPath), content);
        return content;
    }

    /**
     * mainJs 文件md5生成和添加 别名md5 页面md5名
     * 
     * 
     * @memberOf Compile
     */
    async mainJsMd5Build() {
        await dep.src(`${config.bulidPath}/**/*.*`);
        dep.createJsonFile();

        let md5Array = [];
        dep.dependenciesArray.forEach(value => {
            if (value.path.indexOf(config.bulidPath + '/pages/') === 0) {
                let path = value.path.replace(config.bulidPath + '/', '');
                md5Array.push({
                    path: path,
                    md5: gulpClass.pathAddMd5(path, value.md5)
                })
            }
        });
        let indexJsStr = fs.readFileSync(config.bulidPath + '/' + config.mainJsPath).toString();
        indexJsStr += `
            var __md5Array = ${JSON.stringify(md5Array)};
        `;
        indexJsStr += this.getSeajsConfigStringMd5();


        fs.writeFileSync(config.bulidPath + '/' + config.mainJsPath, indexJsStr);

        await new Promise((resolve) => {
            gulp.src(config.bulidPath + '/' + config.mainJsPath, { base: './' })
                .pipe(gulpUglify()).pipe(gulp.dest('./'))
                .on('finish', () => resolve());
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
    async md5Build(path = `${config.bulidPath}/**/*.*`) {
        await dep.src(path);
        dep.createJsonFile();

        let gulpStream = gulp.src(`${config.bulidPath}/**/*.*`, {
            base: config.bulidPath
        }).pipe(gulpClass.md5IgnoreLess())
            .pipe(gulpClass.jsPathReplaceLoader())
            .pipe(gulpClass.delMd5FileLoader())
            .pipe(gulpClass.changeExtnameMd5Loader())
            .pipe(gulp.dest(config.bulidPath))

        return gulpStream;
    }

    addLoader() {

        this.addGulpLoader('.less', [
            () => gulpClass.ignoreLess(),
            () => gulpLess(),
            () => gulpCleanCss()
        ]);

        this.addGulpLoader(['.ts', '.tsx'], [
            () => gulpTypescript(tsconfig),
            () => gulpBabel({ presets: ['es2015'] }),
            () => gulpUglify(),
            () => gulpClass.addDefine(),
        ]);

        this.addGulpLoader(['.js'], [
            () => gulpUglify()
        ]);

        this.addGulpLoader(['.html', '.tpl'], [
            () => gulpClass.htmlReplace()
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
    protected getSeajsConfigStringMd5() {
        let obj = {};

        for (let key in this.dependenciesObj) {
            let element = this.dependenciesObj[key];
            let depObject = dep.dependenciesArray.find(value => value.path === config.bulidPath + '/' + element);

            obj[key] = gulpClass.pathAddMd5(dep.clearPath(ph.join('node_modules', key, 'index.js')), depObject.md5);
        }

        return `\n\n seajs.config({ base: './${config.bulidPath}', alias: ${JSON.stringify(obj)}});`;
    }





}



export default new Compile();
