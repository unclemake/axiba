import * as gulp from 'gulp';
import gulpClass from './gulp';
import * as fs from 'fs';
import * as ph from 'path';

class nodeFile {

    /** 已经打包好的文件路径 */
    nodeFileArray: { name: string, file: string, minFile?: string }[] = [{
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

    nodeModulePath = 'node_modules';

    /**
     * 根据名字获取模块文件
     * @param  {} name
     */
    getFileByName(name, min = false) {
        let pathObj = this.nodeFileArray.find(value => value.name === name);

        try {
            var file = fs.readFileSync(ph.join(process.cwd(), this.nodeModulePath, pathObj.name, min ? pathObj.minFile : pathObj.file));
        } catch (error) {
            console.log('未找到node模块:' + name);
        }

        return file.toString();
    }

    /**
   * 依赖对象转依赖数组
   * @param  {{[key:string]:string}} dependencies
   * @returns string
   */
    dependenciesObjToArr(dependencies: {
        [key: string]: string
    }): {
        name: string,
        version: string,
    }[] {

        let arr = [];
        for (let name in dependencies) {
            let version = dependencies[name];
            arr.push({
                name, version
            })
        }
        return arr;
    }


    /**
    * 获取文件流
    * @param  {string} name
    */
    async getFileStream(name: string) {
        let pathObj = this.nodeFileArray.find(value => value.name === name);
        return gulp.src(ph.join(this.nodeModulePath, pathObj.name, pathObj.file), {
            base: './'
        }).pipe(gulpClass.changeExtnameLoader(`${this.nodeModulePath}/${name}/index.js`));
    }


    getString(name: string) {
        let pathObj = this.nodeFileArray.find(value => value.name === name);
        if (pathObj) {
            return fs.readFileSync(ph.join(this.nodeModulePath, pathObj.name, pathObj.file)).toString();
        } else {
            return '';
        }
    }

}

let npmDep = new nodeFile();

export default npmDep;