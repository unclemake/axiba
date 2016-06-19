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

class CssDependent {


    reg = /((src|href|seajs\.use) *(\(|=) *['"])([^'"]+)(['"])/g

    /**
    * 依赖获取
    * @param  contents 文件内容
    * @param  bl s
    */
    async getMap(vinyl: Vinyl): Promise<MapModle> {

        let depArr = util.regexMatch(vinyl.contents.toString(), this.reg, 4);
        let url = path.normalize(vinyl.path);
        let depObj: {
            [key: string]: string
        } = {};

        for (var i in depArr) {
            var value = depArr[i];
            let depUrl = await this.normalize(url, value);
            depArr[i] = util.clearPath(depUrl);
            depObj[value] = depArr[i];
        }

        return {
            dep: util.clearSameByArr(depArr),
            depObj: depObj
        };
    }

    /**
    * 规范化连接
    * @param path
    * @param dep
    */
    async normalize(path: string, dep: string): Promise<string> {
        dep = Path.join(Path.dirname(path), dep);
        return dep;
    }

    /**
    * 依赖替换
    * @param vinyl
    */
    async replace(vinyl: Vinyl): Promise<Vinyl> {
        try {
            let contents = vinyl.contents.toString();
            let thisMap = dependent.getMap(vinyl.path);

            contents = contents.replace(this.reg, (word, $1, $2, $3, $4, $5) => {


                let map = dependent.getMap(thisMap.depObj[$4]);
                console.log(dependent.getMd5Path($4, map.md5));


                return $1 + dependent.getMd5Path($4, map.md5) + $5;
            });

            vinyl.contents = new Buffer(contents);
            return vinyl;
        } catch (e) {
            util.log(e);
            throw e;
        }
    }


}


var dep = new CssDependent();
export default dep;


