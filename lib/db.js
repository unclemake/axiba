"use strict";
/**
* 数据库 (需重构)
*/
const fs = require('fs');
const util = require('./util');
class Db {
    /**
   * 初始化
   */
    constructor(url) {
        /**
        * 数据库连接
        */
        this.url = __dirname + '/db.json';
        /**
        * 数据库实类
        */
        this.data = [];
        var t = this;
        this.url = __dirname + '/' + url + '.json';
        try {
            this.data = require(this.url);
        }
        catch (e) {
        }
    }
    /**
    * 增加数据
    * @param obj 对象
    */
    insert(obj) {
        var id = util.uuid();
        obj.___id = id;
        this.data.push(obj);
        return id;
    }
    ;
    /**
    * 删除数据
    * @param obj 对象
    */
    delete(obj) {
        var indexArr = [];
        this.data.forEach((value, index) => {
            var bl = true;
            for (var i in obj) {
                if (obj[i] != value[i]) {
                    bl = false;
                }
            }
            if (bl) {
                indexArr.push(index);
            }
        });
        indexArr.forEach((value, index) => {
            this.data.splice(value + index, 1);
        });
        return true;
    }
    ;
    /**
    * 更新数据
    * @param selectObj 获取对象
    * @param updateObj 更新对象
    */
    update(obj, updateObj) {
        this.data = this.data.map((value) => {
            var bl = true;
            for (var i in obj) {
                if (obj[i] != value[i]) {
                    bl = false;
                }
            }
            if (bl) {
                for (var i in updateObj) {
                    value[i] = updateObj[i];
                }
            }
            return value;
        });
        return true;
    }
    ;
    /**
    * 获取数据
    * @param obj 获取对象
    */
    select(obj) {
        var selectArr = [];
        this.data.map((value) => {
            var bl = true;
            for (var i in obj) {
                if (obj[i] != undefined && obj[i] != value[i]) {
                    bl = false;
                }
            }
            if (bl) {
                selectArr.push(value);
            }
        });
        return selectArr;
    }
    ;
    /**
    * 保存更改
    */
    save() {
        var t = this;
        return new Promise((resolve, reject) => {
            fs.writeFile(t.url, JSON.stringify(t.data), function () {
                resolve(t.data);
            });
        });
    }
    ;
    /**
    * 清空数据库
    */
    clear() {
        this.data = [];
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Db;
