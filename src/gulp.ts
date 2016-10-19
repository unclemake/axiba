import * as gulpUtil from 'gulp-util';
import * as gulp from 'gulp';
import * as through from 'through2';
import { default as dep, DependenciesModel } from 'axiba-dependencies';
import { default as npmDep } from 'axiba-npm-dependencies';

export interface TransformFunction {
    (file: gulpUtil.File, enc, callback: (a?: null, file?: gulpUtil.File) => void): void
}


export interface FlushFunction {
    (cb: () => void): void
}


export class Gulp {
    /**
     * 获取文件
     * @param  {string} path
     */
    getFile(path: string): Promise<gulpUtil.File> {
        return new Promise((resolve, reject) => {
            gulp.src(path, {
                base: './'
            }).pipe(this.makeLoader((file, enc, cb) => {
                resolve(file);
            }));
        });
    }


    /**
  * 生成 流插件
  * @param  {string} extname
  * @param {stream.Transform} name loader
  */
    makeLoader(transform: TransformFunction, flush?: FlushFunction) {
        return through.obj(transform, flush);
    }

    /**
    * 生成node模块
    * @param  {} file
    * @param  {} enc
    * @param  {} cb
    */
    bulidNodeModule() {
        let self = this;
        return this.makeLoader(async function (file, enc, callback) {
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
                    this.push(await self.getFile(element));
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
        return this.makeLoader((file, enc, callback) => {
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
        return this.makeLoader((file, enc, callback) => {
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
        return this.makeLoader((file, enc, callback) => {
            var content: string = file.contents.toString();
            content = 'define("' + dep.clearPath(file.path) + '",function(require, exports, module) {' + content + '})';
            file.contents = new Buffer(content);
            return callback(null, file);
        })
    }

}
export default new Gulp();