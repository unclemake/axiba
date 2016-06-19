"use strict"
/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="axiba.ts" />
/// <reference path="../lib/db().ts" />
/// <type="system" />
import db from '../lib/db';


//数据库定义
interface dbTestModle {
    ___id?: string;
    gan: string;
    value?: string;
}

var dbNew = new db<dbTestModle>();


export = new class dbTest<T extends dbTestModle>{
    /**
     * 初始化
     */
    constructor() {
        this.insert();
        console.log('搜索结果：');
        console.log(this.select());
        this.delete();
        this.update();
        this.save();

        console.log('最终结果：');
        console.log(dbNew.data);
    }

    /** 
    * 增加数据
    * @param obj 对象
    */
    insert() {
        dbNew.insert({ gan: '2' });
        dbNew.insert({ gan: '1' });
    };

    /** 
    * 删除数据
    * @param obj 对象
    */
    delete() {
        var obj = dbNew.select({ gan: '2' });
        dbNew.delete(obj[0]);
    };

    /** 
    * 更新数据
    * @param selectObj 获取对象
    * @param updateObj 更新对象
    */
    update() {
        var obj = dbNew.select({ gan: '1' })[0];
        dbNew.update(obj, { gan: '3', value: '哈哈哈哈' });
    };

    /** 
    * 获取数据
    * @param obj 获取对象
    */
    select() {
        return dbNew.select({ gan: '2' });
    };

    /** 
    * 保存更改
    */
    save() {
        return dbNew.save();
    };
};

