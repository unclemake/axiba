/// <reference path="../../../typings/tsd.d.ts" />
/// <type="system" />
"use strict";
const util = require('./util');
const config = require('./config');
var git = new class Git {
    /**
        * 获取远程分支
        * @param  name 本地分支
        */
    pull(name) {
        var t = this;
        if (!name) {
            return t.getBranchName().then(function (name) {
                return t.exec('pull origin ' + name);
            });
        }
        else {
            return this.exec('pull origin ' + name);
        }
    }
    ;
    /**
    * 推送远端
    * @param  name 本地分支
    * @param  longName 远程分支
    */
    push(name, longName) {
        var t = this;
        if (!name) {
            return this.getBranchName().then(function (name) {
                return t.exec('push origin ' + name + ':' + name);
            });
        }
        else {
            return this.exec('push origin ' + name + ':' + longName);
        }
    }
    ;
    /**
    * 合并分支
    * @param  name 分支名
    */
    merge(name) {
        return this.exec('merge ' + name);
    }
    ;
    /**
    * 提交
    * @param msg 提交备注
    */
    commit(msg) {
        msg = msg || config.commitMsg;
        return this.exec('commit -m "' + (msg) + '"');
    }
    ;
    /**
    * 添加所有修改文件到暂存区
    */
    add() {
        return this.exec('add -A');
    }
    ;
    /**
    * 清空暂存区
    */
    reset() {
        return this.exec('reset HEAD');
    }
    ;
    /**
    * 创建分支
    * @param {any} name 分支名
    */
    branch(name) {
        return this.exec('branch ' + name);
    }
    ;
    /**
    * 获取本地分支名称
    */
    getBranchName() {
        return this.exec('branch').then(function (stdout) {
            var reg = new RegExp('\\*.+');
            return reg.exec(stdout)[0].replace('* ', '');
        });
    }
    ;
    /**
    * 获取最后一个提交日记id
    */
    getLastLogId() {
        return this.exec('log -1').then(function (stdout) {
            return /commit.+/.exec(stdout)[0].replace('commit ', '');
        });
    }
    ;
    /**
    * 获取修改了的文件的列表
    * @param cached true 获取暂存区cached
    */
    diff(cached) {
        var execStr = cached ? 'diff --cached --name-only' : 'diff --name-only';
        return this.exec(execStr).then(function (stdout) {
            var packArr = stdout.split('\n');
            packArr.pop();
            return packArr;
        });
    }
    ;
    /**
    * 切换分支 参数为空切换到主干
    * @param  name 分支名称
    */
    checkout(name) {
        name = name || 'master';
        return this.exec('checkout "' + name + '"');
    }
    ;
    /**
    * 获取日记对比列表
    * @param  start 日记id
    * @param  end 日记id
    */
    getLogDiff(start, end) {
        return this.exec('diff ' + start + ' ' + end + ' --name-only').then(function (stdout) {
            var packArr = stdout.split('\n');
            packArr.pop();
            return packArr;
        });
    }
    ;
    /**
   * 执行cmd 命令
   * @param  text 命令
   */
    exec(text) {
        console.log('运行git命令：' + text);
        return util.exec('git ' + text).then(function (stdout) {
            //console.log(stdout);
            return stdout;
        });
    }
    /**
    * 获取项目文件列表
    */
    getFileList() {
        var t = this;
        return this.getLastLogId().then(function (str) {
            return t.getLogDiff(config.startPointId, str);
        });
    }
    /**
       * 记录项目起点
      * @param {string} start 项目起点
       */
    saveStartPointId(start) {
        var t = this;
        if (start) {
            config.startPointId = start;
            return config.save();
        }
        else {
            return this.getLastLogId().then(function (str) {
                config.startPointId = str;
                return config.save();
            });
        }
    }
}
;
module.exports = git;
