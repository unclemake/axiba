"use strict";
/// <type="system" />
//测试
const util = require('../lib/util');
module.exports = new class utilTest {
    constructor() {
        this.log();
    }
    log() {
        //util.log('我是输出！');
        //util.log('我是颜色输出！', chalk.red);
        //return util.log(['我是数组输出1！', '我是数组输出2！']);
        util.log(util.regexMatch("var index_1 = require('../../components / header / index')var index_1 = require('../../components / header / index2')", /require\(['"]([^']+)['"]/g));
    }
    warn() {
        util.warn('我是输出！');
        return util.warn(['我是数组输出1！', '我是数组输出2！']);
    }
    error() {
        util.error('我是输出！');
        return util.error(['我是数组输出1！', '我是数组输出2！']);
    }
    input() {
        return util.input('请输入文字！');
    }
    confirm() {
        return util.confirm('干不干confirm！');
    }
    list() {
        return util.list('我是列表哦', ['选项1', '选项2']);
    }
    createLogFile() {
        return util.createLogFile();
    }
    exec() {
        var ux = util.exec('cls');
        ux.then(function (str) {
            console.log('str');
        });
        return ux;
    }
}
;
