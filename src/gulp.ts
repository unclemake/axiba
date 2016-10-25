import * as gulpUtil from 'gulp-util';
import * as gulp from 'gulp';
import * as through from 'through2';
import { default as dep, DependenciesModel } from 'axiba-dependencies';
import { default as npmDep } from 'axiba-npm-dependencies';
import { TransformFunction, FlushFunction, makeLoader, getFile } from 'axiba-gulp';


export class Gulp {
    /**
    * 生成node模块
    * @param  {} file
    * @param  {} enc
    * @param  {} cb
    */
    bulidNodeModule() {
        return makeLoader(async function (file, enc, callback) {
            await dep.src(file.path);
            let depArray = dep.getDependenciesArr(file.path);
            depArray = depArray.filter(value => dep.isAlias(value));
            for (let key in depArray) {
                let element = depArray[key];
                let filePathArray = await npmDep.get(element);

                console.log(filePathArray.length);

                for (let key in filePathArray) {
                    console.log(key);
                    let element = filePathArray[key];
                    this.push(await getFile(element));
                }
            }
            callback(null, file);
        })
    }

    /**
      * 修改文件名流插件
      * @param  {string} extname
      * @param {stream.Transform} name loader
      */
    changeExtnameLoader(name: string) {
        return makeLoader((file, enc, callback) => {
            file.path = gulpUtil.replaceExtension(file.path, name);
            callback(null, file);
        })
    }

    /**
    * css文件转js文件
    * @param  {} file
    * @param  {} enc
    * @param  {} cb
    */
    cssToJs() {
        return makeLoader((file, enc, callback) => {
            var content: string = file.contents.toString();
            content = '__loaderCss("' + content + '")';
            file.contents = new Buffer(content);
            return callback(null, file);
        })
    }

    /**
      * 编译文件 添加
      */
    addDefine() {
        return makeLoader((file, enc, callback) => {
            var content: string = file.contents.toString();
            content = 'define("' + dep.clearPath(file.path) + '",function(require, exports, module) {' + content + '})';
            file.contents = new Buffer(content);
            return callback(null, file);
        })
    }

}
export default new Gulp();