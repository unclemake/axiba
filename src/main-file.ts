import config from './config';

import nodeModule from 'axiba-npm-dependencies';
import dep from 'axiba-dependencies';

import * as fs from 'fs';
import * as path from 'path';

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
     * 生成框架文件
     * 
     * @returns
     * 
     * @memberOf MainFile
     */
    async buildMainFile() {
        let content: string = '';
        content += await nodeModule.getFileString('axiba-modular');

        // 添加node模块
        let modules = await nodeModule.getPackFileString(this.getMainNodeModules());
        content += modules;

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