"use strict"
/**
* 依赖获取
*/
import Db from '../db';
import * as util  from '../util';
import * as config  from '../config';
import umGulp  from '../gulp';
import jsDep from './js';
import cssDep from './css';
import lessDep from './less';
import htmlDep from './html';
import * as gulp  from 'gulp';
import * as path  from 'path';
import * as fs  from 'fs';
import * as through  from 'through2';
import {Vinyl}  from 'vinyl';
import md5 = require('md5');

//数据库定义
export interface MapModle {
    //文件路径
    path?: string
    //文件依赖
    dep?: string[],
    //依赖替换路径
    depObj?: {
        [key: string]: string
    },
    //文件被依赖
    beDep?: string[],
    //文件md5码
    md5?: string
}


/**
* 依赖
*/
export class Dependent {

    db: Db<MapModle>
    constructor(str: string = 'dependent') {
        this.db = new Db<MapModle>(str);
    }


    /**
    * 文件依赖生成
    * @param  path 文件路径
    * @param  clear 是否清空文件依赖 默认清空
    */
    run(glob: string | string[] = config.baseGlob + '**/*.*'): Promise<any> {
        var t = this;

        var sm = gulp.src(glob)
            .pipe(this.filter())
            .pipe(this.dependent());

        return umGulp.onFinish(sm).then(function () {
            return t.db.save();
        });
    };


    /**
    * 依赖获取
    */
    dependent(): NodeJS.ReadWriteStream {
        return through.obj((file, enc, cb) => {
            try {
                this.createDep(file).then((map) => {
                    map && this.addMap(map);
                    cb();
                });
            }
            catch (e) {
                throw (e);
            }
        });
    }



    /**
    * 获取文件所有数据
    * @param url
    */
    getMap(url: string): MapModle {
        return this.db.select({ path: util.clearPath(url) })[0];
    }


    /**
    * 根据glob 获取文件vinyl 移动位置了
    */
    async getVinylByUrl(glob) {
        return await umGulp.getVinylByUrl(glob);
    };


    /**
    * 根据文件流生成获取文件依赖
    * @param  file 文件流
    * @param  bl 把路径转换为相对路径 默认为false 不替换
    */
    async createDep(file: Vinyl): Promise<MapModle> {
        try {
            var t = this;

            var contents = file.contents.toString();
            var extname = path.extname(file.path).replace('.', '').toLowerCase();

            var depObj: MapModle = {
                dep: [],
                beDep: [],
                path: util.clearPath(file.path),
                depObj: {},
                md5: md5(contents)
            };


            let dep: MapModle;
            switch (extname) {
                case 'js':
                    dep = await jsDep.getMap(file);
                    depObj = util.extend(depObj, dep);
                    break;
                case 'css':
                    dep = await cssDep.getMap(file);
                    depObj = util.extend(depObj, dep);
                    break;
                case 'less':
                    dep = await lessDep.getMap(file);
                    depObj = util.extend(depObj, dep);
                    break;
                case 'html':
                    dep = await htmlDep.getMap(file);
                    depObj = util.extend(depObj, dep);
                    break;
                default:
                    //dep = new Set();
                    break;
            }
            //depObj.dep = Array.from(dep);

            //检测依赖文件是否存在
            for (var i in depObj.dep) {
                var value = depObj.dep[i];
                depObj.dep[i] = util.clearPath(value);
                //var stats = await dependent.fsStats(value);
                //if (!stats) {
                //    util.warn('未找到文件：' + value);
                //}
            }

            return depObj;
        } catch (e) {
            throw (e)
        }
    }


    /**
    * 过滤 过滤掉文件夹
    */
    filter(type: string = 'file'): NodeJS.ReadWriteStream {
        return through.obj((file: Vinyl, enc, cb) => {
            switch (type) {
                case 'folder':
                    !file.contents ? cb(null, file) : cb();
                    break;
                case 'file':
                    file.contents != undefined ? cb(null, file) : cb();
                    break;
            }
        });
    }


    /**
    * 根据路径查询依赖表
    * @param path 文件地址
    */
    getDep(path: string, depArr: string[] = []): string[] {
        path = util.clearPath(path);
        let data = this.db.select({ path: path })[0];
        if (!data) {
            util.warn('依赖表不存在此路径:' + path)
            return [];
        }

        let dep = data.dep;
        dep.forEach((value) => {
            if (depArr.indexOf(path) == -1) {
                dep = dep.concat(this.getDep(value, dep))
            }
        });
        dep = util.clearSameByArr(dep);
        return dep;
    }


    /**
    * 根据路径查询被依赖表
    * @param path 文件地址
    */
    getBeDep(path: string, beDepArr: string[] = []): string[] {
        path = util.clearPath(path);
        let data = this.db.select({ path: path })[0];
        if (!data) {
            util.warn('依赖表不存在此路径:' + path)
            return [];
        }

        let beDep = data.beDep;
        beDep.forEach((value) => {
            if (beDepArr.indexOf(path) == -1) {
                beDep = beDep.concat(this.getBeDep(value, beDep));
            }
        });
        beDep = util.clearSameByArr(beDep);
        return beDep;
    }

    /**
    * 添加依赖到数据库
    * @param  map 
    */
    addMap(map: MapModle) {
        try {
            //数据
            var mapSelect = this.getMap(map.path);

            if (mapSelect) {
                mapSelect.dep && mapSelect.dep.forEach((va, i) => {
                    this.delBeDep(va, [map.path]);
                });

                //保存原有的被依赖
                map.beDep = map.beDep.concat(mapSelect.beDep);
                this.db.update(mapSelect, map);
            } else {
                this.db.insert(map);
            }

            map.dep && map.dep.forEach((va, i) => {
                this.addBeMap({
                    path: va,
                    beDep: [map.path]
                });
            });
        } catch (e) {
            throw (e)
        }
    }

    /**
  * 添加依赖到数据库
  * @param  map 
  */
    delMap(path: string) {
        try {
            //数据
            var mapSelect = this.getMap(path);

            if (mapSelect) {
                mapSelect.dep && mapSelect.dep.forEach((va, i) => {
                    this.delBeDep(va, [mapSelect.path]);
                });

                this.db.delete(mapSelect);
            }

        } catch (e) {
            throw (e)
        }
    }

    /**
    * 计算 md5 路径
    * @param map
    */
    getMd5Path(paths: string, md5: string): string {
        let url = path.parse(paths);
        if (md5) {
            return url.dir + '/' + url.name + '-' + md5.slice(0, 8) + url.ext;
        } else {
            return paths;
        }
    }

    /**
    * 添加被依赖 到数据库
    * @param map
    */
    addBeMap(map: MapModle) {
        var mapSelect = this.getMap(map.path);
        let beDep = map.beDep;
        if (mapSelect) {
            beDep = mapSelect.beDep.concat(beDep);
            this.db.update(mapSelect, { beDep: beDep });
        } else {
            this.db.insert(map);
        }
    }


    /**
    * 清空被依赖文件 (每次添加依赖文件的时候需要删除旧的依赖文件)
    * @param  path 文件地址
    * @param  dep 文件名称
    */
    delBeDep(path: string, beDep: string[]): void {
        var t = this;
        var map = t.db.select({ path: path })[0];
        if (map && beDep) {
            var newArr = [];
            map.beDep.forEach(function (va, i) {
                beDep.indexOf(va) == -1 && newArr.push(va);
            });

            map.beDep = newArr;
        }
    }


    /**
    * 根据绝对路径 更新值
    * @param  path 文件地址
    * @param  obj 值
    */
    update(path: string, obj): boolean {
        var map = this.db.select({ path: util.clearPath(path) })[0];
        return this.db.update(map, obj);
    }


    /**
    * 获取文件状态
    */
    fsStats(path: string): Promise<fs.Stats> {
        return new Promise((resolve) => {
            fs.stat(util.clearPathParameter(path), (err, stats) => {
                resolve(stats);
            });
        });
    }

}

var dependent = new Dependent();
export default dependent;


