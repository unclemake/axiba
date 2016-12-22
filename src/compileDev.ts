import gulpClass from './gulp';
import config from './config';

import { getDevFileString, reload } from 'axiba-server';
import util from 'axiba-util';
import * as gulp from 'gulp';
import { default as dep } from 'axiba-dependencies';
import nodeModule from 'axiba-npm-dependencies';
import * as through from 'through2';
import * as ph from 'path';
import * as fs from 'fs';
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
export class CompileDev {

    /**
     * 记录别名依赖用于 seajs配置写入
     * 
     * @type {{ [key: string]: string }}
     * @memberOf Compile
     */
    dependenciesObj: { [key: string]: string } = {}


    /**
     * 流插件 列表
     * 
     * 
     * @memberOf CompileDev
     */
    loaderList: {
        /**
         * 后缀名
         * 
         * @type {string}
         */
        extname: string,
        /**
         * 流处理列表
         */
        loaderArray: (() => any)[]
    }[] = [];




    depNodeModules: string[] = [];

    /**
     * Creates an instance of Axiba.
     * 
     * 
     * @memberOf Axiba
     */
    constructor() {
        this.addLoader();
    }

    /**
     * 扫描依赖
     * 
     * 
     * @memberOf Compile
     */
    async scanDependence() {
        dep.dependenciesArray = [];
        await dep.src(`${config.assets}/**/*.*`);
        dep.createJsonFile();
    }



    /**
     * 打包node模块
     * 
     * @returns
     * 
     * @memberOf CompileDev
     */
    async packNodeDependencies(depArray = this.getAssetsDependencies()) {
        let depArrayH = depArray.filter(value => {
            return !config.mainModules.find(path => value.indexOf(path) === 0);
        });

        let nodeArray: Array<Array<string>> = this.getNodeArray(depArrayH);
        util.log('打包node模块：');

        for (let key in nodeArray) {
            let value = nodeArray[key];
            let alias = '';
            if (value[0].indexOf('/') === -1) {
                alias = value[0];
            } else {
                alias = value[0].match(/.+?(?=\/)/g)[0];
            }
            util.log(alias);
            let externalsArray = depArray.filter(dep => value.indexOf(dep) === -1);

            await this.bulidNodeModule(value, externalsArray, alias);
        }
        return nodeArray;
    }

    /**
     * 生成框架文件
     * 
     * @returns
     * 
     * @memberOf CompileDev
     */
    async buildMainFile() {
        let content: string = '';
        content += await nodeModule.getFileString('seajs');
        content += await nodeModule.getFileString('seajs-css');
        content += this.getSeajsConfigString();
        content += await nodeModule.getFileString('babel-polyfill');

        if (config.hotload) {
            // 添加调试脚本
            content += this.getDevFileString();
        }

        // 添加node模块
        let modules = await nodeModule.getPackFileString(this.getMainNodeModules(), [], true);
        content += modules;

        this.mkdirsSync(config.bulidPath);
        fs.writeFileSync(ph.join(config.bulidPath, config.mainJsPath), content);
        return content;
    }


    /**
     * 生成全部文件
     * 
     * 
     * @memberOf CompileDev
     */
    async build() {
        for (let key in this.loaderList) {
            let element = this.loaderList[key];

            let gulpStream = gulp.src(`${config.assets}/**/*${element.extname}`, {
                base: config.assets
            });

            await new Promise((resolve) => {
                this.loader(gulpStream, element.extname)
                    .pipe(gulp.dest(config.bulidPath))
                    .on('finish', () => resolve());
            });
        }
    }

    /**
     * 启动监视
     * 
     * 
     * @memberOf CompileDev
     */
    watch() {
        watch(config.assets + '/**/*.*', async (file) => {
            if (this.loaderList.find(value => value.extname === ph.extname(file.path))) {
                switch (file.event) {
                    case 'add':
                        await this.changed(file.path);
                        break;
                    case 'change':
                        await this.changed(file.path);
                        break;
                    case 'unlink':
                        await this.deleted(file.path);
                        break;
                }
                reload();
            }
        });

        process.on('uncaughtException', function (err) {
            console.log('出错咯' + err);
        });

    }

    protected getDevFileString() {
        return getDevFileString();
    }


    /**
     * 获取项目  依赖的node模块 模块名数组
     * 
     * @returns
     * 
     * @memberOf Axiba
     */
    protected getAssetsDependencies() {
        let depSet = new Set();
        dep.dependenciesArray.forEach(value => {
            if (value.path.indexOf(config.assets) === 0) {
                value.dep.forEach(path => {
                    if (path.indexOf(config.assets) !== 0 && dep.isAlias(path)) {
                        depSet.add(path);
                    }
                })
            }
        });
        let depArray: string[] = [...depSet];
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
    protected async bulidNodeModule(pathArray: Array<string>, externalsArray, alias) {
        let contents = await nodeModule.getPackFileString(pathArray, externalsArray);
        let path = ph.join(config.bulidPath, 'node_modules', alias);
        this.mkdirsSync(path);
        fs.writeFileSync(ph.join(path, 'index.js'), contents);
        this.saveAlias(pathArray, dep.clearPath(ph.join('node_modules', alias, 'index.js')));
    };


    /**
     * 生成路径
     * 
     * @param {any} dirpath
     * @returns
     * 
     * @memberOf Axiba
     */
    protected mkdirsSync(dirpath) {
        if (!fs.existsSync(dirpath)) {
            let pathtmp;
            dirpath.split(ph.sep).forEach(function (dirname) {
                if (pathtmp) {
                    pathtmp = ph.join(pathtmp, dirname);
                } else {
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
    protected saveAlias(pathArray: Array<string>, path: string) {
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
    protected getNodeArray(depArray: string[]) {
        let nodeArray: Array<Array<string>> = [];
        depArray.forEach(path => {
            if (path.indexOf('/') === -1) {
                nodeArray.push([path])
            } else {
                let alias = path.match(/.+?(?=\/)/g)[0];
                let nodeArrayGet = nodeArray.find(nodeArray => nodeArray[0].indexOf(alias) === 0);
                if (nodeArrayGet) {
                    nodeArrayGet.push(path);
                } else {
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
    protected getMainNodeModules() {
        let depArray = this.getAssetsDependencies();
        depArray = depArray.filter(value => {
            return !!config.mainModules.find(path => value.indexOf(path) === 0);
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
    protected getSeajsConfigString() {
        return `\n\n seajs.config({ base: './${config.bulidPath}', alias: ${JSON.stringify(this.dependenciesObj)}});`;
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
    protected loader(gulpStream: NodeJS.ReadWriteStream, extname: string) {
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
    protected addLoader() {
        this.addGulpLoader('.less', [
            () => gulpClass.ignoreLess(),
            () => gulpLess()
            // () => gulpClass.changeExtnameLoader('.less.js', /\.css/g),
            // () => gulpMinifyCss(),
            // () => gulpClass.cssToJs(),
            // () => gulpClass.addDefine(),
        ]);

        this.addGulpLoader(['.ts', '.tsx'], [
            () => sourcemaps.init(),
            () => gulpTypescript(tsconfig),
            // () => gulpClass.jsPathReplace(),
            () => gulpClass.addDefine(),
            // () => gulpBabel({ presets: ['es2015'] }),
            // () => gulpUglify({ mangle: false }),
            () => sourcemaps.write('./', {
                sourceRoot: '/' + config.assets
            })
        ]);

        this.addGulpLoader(['.js'], [
            () => gulp.dest(config.bulidPath)]);
        this.addGulpLoader(['.html', '.tpl'], [
            () => gulpClass.htmlReplace(),
        ]);
        this.addGulpLoader(['.png', '.jpg', '.jpeg'], [
        ]);
        this.addGulpLoader(['.eot', '.svg', '.ttf', '.woff'], [
        ]);
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
    protected addGulpLoader(extname: string | string[], gulpLoader?: (() => any)[]) {

        if (typeof (extname) === 'object') {
            extname.forEach(value => this.addGulpLoader(value, gulpLoader))
            return;
        }

        let loaderObj = this.loaderList.find(value => value.extname === extname);
        if (!loaderObj) {
            loaderObj = {
                extname: extname as string, loaderArray: []
            };
            this.loaderList.push(loaderObj)
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
    protected async deleted(path: string) {
        let depObj = await dep.getDependenciesByPath(path);

        if (depObj.extend['bulidFile']) {
            (depObj.extend['bulidFile'] as string[]).forEach(value => {
                let path = value.replace(config.assets, config.bulidPath);
                if (fs.existsSync(path)) {
                    fs.unlinkSync(path);
                }
            });
        }

        // dep.delByPath(path);
    }

    /**
     * 改变方法
     * 
     * @param {string} path
     * @returns
     * 
     * @memberOf Axiba
     */
    protected async changed(path: string) {
        let extname = ph.extname(path).toLowerCase();
        let pathArr = [path];
        await dep.src(path);
        let depObj = await dep.getDependenciesByPath(path);
        switch (extname) {
            case '.less':
                pathArr = pathArr.concat(depObj.beDep);
                break;
        }

        let gulpStream = gulp.src(pathArr, {
            base: config.assets
        });

        // 检查是否有node模块写入了
        let depSet = new Set<string>();
        depObj.dep.forEach(path => {
            if (path.indexOf(config.assets) !== 0 && dep.isAlias(path)) {
                depSet.add(path);
            }
        });
        let depArray = [...depSet];
        depArray = depArray.filter(value => {
            return !this.depNodeModules.find(name => name === value);
        });

        if (depArray.length > 0) {
            await this.buildMainFile();
            await this.packNodeDependencies();
        }


        depObj.extend['bulidFile'] = [];
        return await new Promise((resolve) => {
            this.loader(gulpStream, ph.extname(path))
                .pipe(through.obj((file, enc, callback) => {
                    let bl = /^_.+/g.test(ph.basename(file.path));
                    if (extname !== '.less' || (extname === '.less' && !bl)) {
                        depObj.extend['bulidFile'].push(dep.clearPath(file.path));
                    }
                    callback(null, file);
                }))
                .pipe(gulp.dest(config.bulidPath))
                .on('error', () => {
                    {
                        console.log('出错了');
                    }
                }).on('finish', () => {
                    resolve();
                });
        });
    }

}


export default new CompileDev();
