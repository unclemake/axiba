/// <reference path="../typings/tsd.d.ts" />
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
/**
*基础方法
*/
const chalk = require('chalk');
const fs = require('fs');
const inquirer = require('inquirer');
const child_process_1 = require('child_process');
var exp = new class umUtil {
    constructor() {
        /** 记录日记*/
        this.logStr = '';
    }
    /**
   * 普通页面log
   * @param {string} msg log文字
   * @param {string} msg 文字颜色
   */
    log(msg, chalk) {
        var t = this;
        if (chalk) {
            console.log(chalk(msg));
        }
        else {
            console.log(msg);
        }
        t.logAdd(msg);
        //if (typeof (msg) == 'string') {
        //    console.log(chalk(msg));
        //    t.logAdd(chalk(msg));
        //} else {
        //    msg.forEach(function (va, i) {
        //        console.log(chalk(va));
        //        t.logAdd(chalk(va));
        //    });
        //}
    }
    /**
    * 添加日记
    * @param {string} msg 输出文字
    * @returns {log} log
    */
    logAdd(msg) {
        this.logStr += msg + '\n';
        return this;
    }
    /**
    * 输出警告
    * @param {string} msg log文字
    */
    warn(msg) {
        return this.log(msg, chalk.yellow);
    }
    /**
    * 输出错误
    * @param {string} msg log文字
    */
    error(msg) {
        return this.log(msg, chalk.red);
    }
    /**
    * 输出成功
    * @param {string} msg log文字
    */
    success(msg) {
        return this.log(msg, chalk.green);
    }
    /**
    * 输入文字
    */
    input(message) {
        return new Promise(function (resolve) {
            inquirer.prompt([{
                    type: 'input',
                    name: 'type',
                    message: message + '\n'
                }]).then(function (answers) {
                resolve(answers['type'].toString().replace(/(^\s*)|(\s*$)/g, ''));
            });
        });
    }
    /**
    * 询问列表
    */
    confirm(msg) {
        return new Promise(function (resolve, reject) {
            inquirer.prompt([{
                    type: 'confirm',
                    name: 'type',
                    message: msg + '\n'
                }]).then(function (answers) {
                if (answers['type']) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
        });
    }
    /**
    * 列表选择
    */
    list(msg, list) {
        return new Promise(function (resolve) {
            for (var i in list) {
                list[i] = parseInt(i) + 1 + '. ' + list[i];
            }
            inquirer.prompt([{
                    type: 'list',
                    name: 'type',
                    message: msg,
                    choices: list
                }]).then(function (answers) {
                var str = answers['type'].toString();
                resolve(parseInt(str.substring(0, str.indexOf('.'))) - 1);
            });
        });
    }
    /**
    * 生成日记文件
    */
    createLogFile() {
        fs.writeFile('./um-error-log.txt', this.logStr, 'utf8', function () {
            console.log('生成了错误日记');
        });
    }
    /**
    * 执行cmd 命令
    * @param  text 命令
    */
    exec(text) {
        var t = this;
        return new Promise((resolve, reject) => {
            child_process_1.exec(text, { cwd: process.cwd(), maxBuffer: 10240 * 10240 }, function (error, stdout, stderr) {
                if (error !== null) {
                    t.error('exec 命令出错： ' + text);
                    t.log(error);
                    reject(stdout);
                }
                else {
                    resolve(stdout);
                }
            });
        });
    }
    /**
* 清除数组相同值
* @param  arr 当前文件路径
* @return 相对文件路径
*/
    clearSameByArr(arr) {
        return Array.from(new Set(arr));
    }
    /**
   * 解决js不支持 后发断言
   * @param  str 匹配字符串
   * @param  regex 正则字符串
   */
    regexMatch(str, regex, index = 1) {
        var matchArr = str.match(regex) || [];
        for (var i in matchArr) {
            matchArr[i].match(regex);
            matchArr[i] = RegExp['$' + index];
        }
        return matchArr;
    }
    /**
    * 清理路径
    * @param  path 路径名称
    */
    clearPath(path) {
        if (path.indexOf(process.cwd()) == 0) {
            path = path.replace(process.cwd() + '\\', '');
        }
        path = path.replace(/\\/g, '/').replace(/\.\//g, '');
        if (path.indexOf('./') != 0) {
            path = path.replace(/\.\//g, '');
        }
        else {
            path = path.replace(/\.\//g, '');
            path = './' + path;
        }
        return this.clearPathParameter(path);
    }
    /**
   * 清理路径参数
   * @param  path 路径名称
   */
    clearPathParameter(path) {
        return path.replace(/\?.+/g, '').replace(/#.+/g, '');
    }
    /**
    * 唯一码
    */
    uuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        var uuid = s.join("");
        return uuid;
    }
    /**
   * 合并set
   */
    concatSet(set, set2) {
        set2.forEach((value) => {
            set.add(value);
        });
        return set;
    }
    /**
     * 清除前后空格
     * @param str
     */
    trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    }
    ;
    /**
     * 性能测试
     * @param fun
     */
    performanceTest(fun) {
        return __awaiter(this, void 0, Promise, function* () {
            var startTime = new Date();
            yield fun();
            var endTime = new Date();
            var pTime = (endTime.getTime() - endTime.getTime()).toString();
            this.warn(pTime);
            return pTime;
        });
    }
    ;
    /**
     * 合并对象
     * @param o
     * @param n
     * @param override 是否覆盖
     */
    extend(destination, source) {
        for (var property in source)
            destination[property] = source[property];
        return destination;
    }
}
;
module.exports = exp;
