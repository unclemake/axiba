var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const axiba_npm_dependencies_1 = require("axiba-npm-dependencies");
const axiba_dependencies_1 = require("axiba-dependencies");
const axiba_server_1 = require("axiba-server");
const fs = require("fs");
const path = require("path");
const UglifyJS = require("uglify-js");
/**
 * 框架生成类
 *
 * @class Main
 */
class MainFile {
    constructor() {
        this.depNodeModules = [];
    }
    /**
    * 获取项目  依赖的node模块 模块名数组
    *
    * @returns
    *
    * @memberOf Axiba
    */
    getAssetsDependencies() {
        let depSet = new Set();
        axiba_dependencies_1.default.dependenciesArray.forEach(value => {
            if (value.path.indexOf(config_1.default.assets) === 0) {
                value.dep.forEach(path => {
                    if (path.indexOf(config_1.default.assets) !== 0 && axiba_dependencies_1.default.isAlias(path)) {
                        depSet.add(path);
                    }
                });
            }
        });
        let depArray = [...depSet];
        this.depNodeModules = depArray;
        return depArray;
    }
    addDep(DepModel) {
        return __awaiter(this, void 0, void 0, function* () {
            let bl = false;
            DepModel.dep.forEach(path => {
                if (path.indexOf(config_1.default.assets) !== 0 && axiba_dependencies_1.default.isAlias(path) && this.depNodeModules.indexOf(path) === -1) {
                    bl = true;
                }
            });
            if (bl) {
                yield this.buildMainFile();
                axiba_server_1.reload(config_1.default.output + '/' + config_1.default.main);
            }
        });
    }
    /**
     * 获取所有main 需要打包的模块
     *
     * @protected
     * @returns
     *
     * @memberOf Compile
     */
    getMainNodeModules() {
        let depArray = this.getAssetsDependencies();
        depArray = depArray.filter(value => {
            return !config_1.default.mainModules.find(path => value === path);
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
    buildMainFile() {
        return __awaiter(this, void 0, void 0, function* () {
            let content = '';
            content += (yield axiba_npm_dependencies_1.default.getFileString('axiba-modular')) + ';\n\r';
            content += (yield axiba_npm_dependencies_1.default.getFileString('babel-polyfill')) + ';\n\r';
            content = content.replace(/^"use strict";/g, '');
            // 添加调试脚本
            content += axiba_server_1.getDevFileString();
            // 添加node模块
            console.log(this.getMainNodeModules());
            let modules = yield axiba_npm_dependencies_1.default.getPackFileString(this.getMainNodeModules());
            content += modules;
            config_1.default.mainFile.forEach(value => {
                content += fs.readFileSync(path.join(config_1.default.assets, value), 'utf-8');
            });
            this.mkdirsSync(config_1.default.output);
            fs.writeFileSync(path.join(config_1.default.output, config_1.default.main), content);
            return content;
        });
    }
    /**
     * 生成min框架
     *
     * @returns
     *
     * @memberOf MainFile
     */
    buildMainFileMin() {
        return __awaiter(this, void 0, void 0, function* () {
            let content = '';
            content += (yield axiba_npm_dependencies_1.default.getFileString('axiba-modular')) + ';\n\r';
            content += (yield axiba_npm_dependencies_1.default.getFileString('babel-polyfill')) + ';\n\r';
            content = content.replace(/^"use strict";/g, '');
            // 添加node模块
            let modules = yield axiba_npm_dependencies_1.default.getPackFileString(this.getMainNodeModules());
            content += modules;
            content = UglifyJS.minify(content, { fromString: true }).code;
            this.mkdirsSync(config_1.default.output);
            fs.writeFileSync(path.join(config_1.default.output, config_1.default.main), content);
            return content;
        });
    }
    /**
     * 生成路径 (生成文件前需要生成路径)
     *
     * @param {any} dirpath
     * @returns
     *
     * @memberOf Axiba
     */
    mkdirsSync(dirpath) {
        if (!fs.existsSync(dirpath)) {
            let pathtmp;
            dirpath.split(path.sep).forEach(function (dirname) {
                if (pathtmp) {
                    pathtmp = path.join(pathtmp, dirname);
                }
                else {
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
exports.default = new MainFile();
//# sourceMappingURL=main-file.js.map
