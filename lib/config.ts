/// <type="system" />
"use strict"
/**
* @file config
* @class config
* @classdesc  配置
*/

import fs = require('fs');
import Db from './db';


interface configModle {
    name: string,
    val: string
}

class config {

    db: Db<configModle>;

    constructor() {
        var t = this;
        this.db = new Db<configModle>('config');

        this.db.data.map(function (val) {
            t[val.name] = val.val;
        });
    }

    /**
   * 更新数据
   */
    private dbUpdata(name: string)
    private dbUpdata(name: Array<string>)
    private dbUpdata(name) {
        var t = this;
        var obj = this.db.select({ name: name })[0];

        if (typeof (name) != 'string') {
            name.forEach(function (va, i) {
                t.dbUpdata(va);
            })
            return;
        }

        if (obj) {
            this.db.update(obj, { val: this[name] });
        } else {
            this.db.insert({ name: name, val: this[name] });
        }

    }

    /**
   * 保存数据
   */
    save(): Promise<any> {
        this.dbUpdata(['state', 'startPointId', 'commitMsg']);
        return this.db.save();
    }


    //用来判断是不是文件
    isFile = 'js|ts|tsx|css|less|sass|html|tpl|txt|xml|json'


    //项目状态 0 未开始 1开始 2结束
    state = 0;
    //项目git起点
    startPointId = "17c565518e397c2e4712ac747f2004eda850c891";
    //git提交注释
    commitMsg = "我是注释";



    //静态文件过滤 不是_开始文件 文件格式限定
    ignore = /^[^_].+\.(js|ts|css|less|sass|html|tpl|txt|xml|json)/;

    //gulp uglify构建路径
    glob = {
        //js路径
        js: '**/*.js',
        //css路径
        css: '**/*.css',
        //img
        img: '**/*.?(jpg|png|gif|jpeg)',

        //less路径
        less: '**/*.less',

        //ts路径
        ts: '**/*.?(tsx|ts)',

        //html
        html: '**/*.?(tpl|html)',

        //其他拷贝文件
        other: '**/*.?(woff|ttf)'
    };



    //map文件类型检索映射
    mapType = {
        'phtml': 'html'
    };

    //git添加目录
    addGlob = [
        "./application",
        "./node_modules",
        "./public",
        "./assets"
    ];

    //静态文件路径
    baseGlob = 'assets/';
    webModules = this.baseGlob + 'components/';
    //静态输出路径
    distGlob = 'public/';

    //合并列表
    concat = [
        {
            name: "test.js",
            dest: "assets/components/global/1.0/",
            list: [
                "assets/components/seajs/2.3.0/sea.js",
                "assets/components/seajs-css/1.0.5/src/seajs-css.js ",
                "assets/components/seajs-text/1.1.1/src/seajs-text.js ",
                "assets/components/global/1.0/seajsConfig.js",

                "node_modules/react/dist/react.min.js",
                "node_modules/redux/dist/redux.min.js",
                "node_modules/react-redux/dist/react-redux.min.js",
                "node_modules/react-dom/dist/react-dom.min.js",
                "node_modules/react-router/umd/ReactRouter.min.js",

                'reduce-reducers',
                'flux-standard-action',
                'redux-actions',

                'react-router-redux',
                'rc-upload',

                "assets/components/global/1.0/global.js"
            ]
        }

    ]

    //自定义目录 用于生成打包文件，自定义的帮助开发项目文件的导入
    customPath = "./";

    //依赖模块 别名定义
    alias = {
        'react': 'node_modules/react/dist/react.min.js',
        'redux': 'node_modules/redux/dist/redux.min.js',
        'react-redux': "node_modules/react-redux/dist/react-redux.min.js",
        'react-dom': "node_modules/react-dom/dist/react-dom.min.js",
        'react-router': "node_modules/react-router/umd/ReactRouter.min.js"
    }

}

var newConfig: config = new config();



try {
    var cof = require(process.cwd() + '/axibaConfig.js');
    newConfig = Object.assign(newConfig, cof);
} catch (e) {
    console.log('配置没写');
}

export = newConfig;