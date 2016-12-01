define("components/util/index.js",function(require, exports, module) {
// 通用方法
"use strict";
/**
* 获取字符串长度 中文 = 2 英文 = 1
*/
function getLength(value) {
    return value.replace(/[^\x00-\xff]/g, "01").length / 2;
}
exports.getLength = getLength;
;
/**
* 返回随机值
* @param {int} min 最小值
* @param {int} max 最大值
*/
function rand(min = 0, max = 2147483647) {
    var argc = arguments.length;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.rand = rand;
;
/**
   * 前后去空格
   * @param {string}  格式化后的日期
   */
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
}
exports.trim = trim;
;
});
//# sourceMappingURL=index.js.map
