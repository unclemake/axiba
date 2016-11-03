"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const gulp = require('gulp');
const gulp_1 = require('./gulp');
const fs = require('fs');
const ph = require('path');
class nodeFile {
    constructor() {
        /** 已经打包好的文件路径 */
        this.nodeFileArray = [{
                name: 'antd',
                file: 'dist/antd.js',
                minFile: 'dist/antd.min.js'
            }, {
                name: 'react',
                file: 'dist/react.js',
                minFile: 'dist/react.min.js'
            }, {
                name: 'react-router',
                file: 'umd/ReactRouter.js',
                minFile: 'umd/ReactRouter.min.js'
            }, {
                name: 'react-dom',
                file: 'dist/react-dom.js',
                minFile: 'dist/react-dom.min.js'
            }, {
                name: 'react-redux',
                file: 'dist/react-redux.js',
                minFile: 'dist/react-redux.min.js'
            }, {
                name: 'redux',
                file: 'dist/redux.js',
                minFile: 'dist/redux.min.js'
            }, {
                name: 'redux-actions',
                file: 'dist/redux-actions.js',
                minFile: 'dist/redux-actions.min.js'
            }, {
                name: 'redux-thunk',
                file: 'dist/redux-thunk.js',
                minFile: 'dist/redux-thunk.min.js',
            }, {
                name: 'superagent',
                file: 'superagent.js'
            }, {
                name: 'socket.io-client',
                file: 'socket.io.js'
            }, {
                name: 'babel-polyfill',
                file: 'dist/polyfill.js',
                minFile: 'dist/polyfill.min.js',
            }];
        this.nodeModulePath = 'node_modules';
    }
    /**
     * 根据名字获取模块文件
     * @param  {} name
     */
    getFileByName(name, min = false) {
        let pathObj = this.nodeFileArray.find(value => value.name === name);
        try {
            var file = fs.readFileSync(ph.join(process.cwd(), this.nodeModulePath, pathObj.name, min ? pathObj.minFile : pathObj.file));
        }
        catch (error) {
            console.log('未找到node模块:' + name);
        }
        return file.toString();
    }
    /**
   * 依赖对象转依赖数组
   * @param  {{[key:string]:string}} dependencies
   * @returns string
   */
    dependenciesObjToArr(dependencies) {
        let arr = [];
        for (let name in dependencies) {
            let version = dependencies[name];
            arr.push({
                name: name, version: version
            });
        }
        return arr;
    }
    /**
    * 获取文件流
    * @param  {string} name
    */
    getFileStream(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let pathObj = this.nodeFileArray.find(value => value.name === name);
            return gulp.src(ph.join(this.nodeModulePath, pathObj.name, pathObj.file), {
                base: './'
            }).pipe(gulp_1.default.changeExtnameLoader(`${this.nodeModulePath}/${name}/index.js`));
        });
    }
    getString(name) {
        let pathObj = this.nodeFileArray.find(value => value.name === name);
        if (pathObj) {
            return fs.readFileSync(ph.join(this.nodeModulePath, pathObj.name, pathObj.file)).toString();
        }
        else {
            return '';
        }
    }
}
let npmDep = new nodeFile();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = npmDep;

//# sourceMappingURL=nodefile.js.map
