// 通用方法


/**
* 获取字符串长度 中文 = 2 英文 = 1
*/
export function getLength(value: string): number {
    return value.replace(/[^\x00-\xff]/g, "01").length / 2;
};

/**
* 返回随机值
* @param {int} min 最小值
* @param {int} max 最大值
*/
export function rand(min: number = 0, max: number = 2147483647): number {
    var argc = arguments.length;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
   * 前后去空格
   * @param {string}  格式化后的日期
   */
export function trim(str: String): string {
    return str.replace(/(^\s*)|(\s*$)/g, '');
};

