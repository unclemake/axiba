import config from './config';

import nodeModule from 'axiba-npm-dependencies';
import dep, { DependenciesModel } from 'axiba-dependencies';
import { getDevFileString, reload } from 'axiba-server';

import * as fs from 'fs';
import * as path from 'path';
const UglifyJS = require("uglify-js");

/**
 * 框架生成类
 * 
 * @class Main
 */
class MainFile {
    depNodeModules: string[] = [];

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


    async  addDep(DepModel: DependenciesModel) {
        let bl = false;
        DepModel.dep.forEach(path => {
            if (path.indexOf(config.assets) !== 0 && dep.isAlias(path) && this.depNodeModules.indexOf(path) === -1) {
                bl = true;
            }
        })
        if (bl) {
            await this.buildMainFile();
            reload(config.output + '/' + config.main);
        }
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
            return !config.mainModules.find(path => value === path);
        }).filter(value => value.indexOf('@') !== 0);
        return depArray;
    }

    /**
     * 生成框架文件
     * 
     * @returns
     * 
     * @memberOf MainFile
     */
    async buildMainFile() {
        let content: string = '';
        content += await nodeModule.getFileString('axiba-modular') + ';\n\r';
        content += await nodeModule.getFileString('babel-polyfill') + ';\n\r';
        content = content.replace(/^"use strict";/g, '');
        // 添加调试脚本
        content += getDevFileString();

        // 添加node模块
        console.log(this.getMainNodeModules());
        let modules = await nodeModule.getPackFileString(this.getMainNodeModules());
        content += modules;

        config.mainFile.forEach(value => {
            content += fs.readFileSync(path.join(config.assets, value), 'utf-8');
        })

        this.mkdirsSync(config.output);
        fs.writeFileSync(path.join(config.output, config.main), content);
        return content;
    }

    /**
     * 生成min框架
     * 
     * @returns
     * 
     * @memberOf MainFile
     */
    async buildMainFileMin() {
        let content: string = '';
        content += await nodeModule.getFileString('axiba-modular') + ';\n\r';
        content += await nodeModule.getFileString('babel-polyfill') + ';\n\r';
        content = content.replace(/^"use strict";/g, '');

        // 添加node模块
        let modules = await nodeModule.getPackFileString(this.getMainNodeModules());
        content += modules;
        content = UglifyJS.minify(content, { fromString: true }).code
        this.mkdirsSync(config.output);
        fs.writeFileSync(path.join(config.output, config.main), content);
        return content;
    }

    /**
     * 生成路径 (生成文件前需要生成路径)
     * 
     * @param {any} dirpath
     * @returns
     * 
     * @memberOf Axiba
     */
    protected mkdirsSync(dirpath) {
        if (!fs.existsSync(dirpath)) {
            let pathtmp;
            dirpath.split(path.sep).forEach(function (dirname) {
                if (pathtmp) {
                    pathtmp = path.join(pathtmp, dirname);
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

}


export default new MainFile();