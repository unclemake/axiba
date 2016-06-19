"use strict"
/**
* less 文件依赖
*/
import * as util  from '../util';
import * as Path  from 'path';
import * as fs  from 'fs';
import * as config  from '../config';
import {Vinyl}  from 'vinyl';
import {default as dependent, MapModle} from './index';
import * as path  from 'path';

class LessDependent {

    reg = /(@import.*\(['"])([^'"]+)(['"]\))/g

    /**
    * 依赖获取
    * @param  contents 文件内容
    * @param  bl s
    */
    async getMap(vinyl: Vinyl): Promise<MapModle> {

        let depArr = util.regexMatch(vinyl.contents.toString(), this.reg, 2);
        let url = path.normalize(vinyl.path);
        let depObj: {
            [key: string]: string
        } = {};

        for (var i in depArr) {
            var value = depArr[i];
            depArr[i] = util.clearPath(await this.normalize(url, value));
            depObj[value] = depArr[i];
        }

        return {
            dep: util.clearSameByArr(depArr),
            depObj: depObj
        };
    }


    /**
    * js 文件依赖判断 是否是别名
    * @param  str 路径名称
    */
    async normalize(path: string, dep: string): Promise<string> {
        dep = Path.join(Path.dirname(path), dep);

        if (!Path.extname(dep)) {
            dep += '.less'
        }

        return dep;
    }

}


var dep = new LessDependent();
export default dep;


