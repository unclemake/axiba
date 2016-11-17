define("components/validate/rule.js",function(require, exports, module) {"use strict";
exports.messages = {
    required: () => "必填！",
    number: (value, parameter) => `请输入正整数！`,
    min: (value, parameter) => `必须大于等于 ${parameter}`,
    max: (value, parameter) => `必须小于等于 ${parameter}`,
    minLength: (value, parameter) => `长度必须大于等于 ${parameter} (两个英文等于1)`,
    maxLength: (value, parameter) => `长度必须大于等于 ${parameter} (两个英文等于1)`,
    noSymbol: (value, parameter) => `必须是中文或英文,数字`,
    telephone: (value, parameter) => `必须是手机号码`,
};
/**
 * 正则集合
 */
exports.regExpArray = {
    get required() { return /[^\s]/g; },
    get number() { return /^[0-9]\d*$/g; },
    get noSymbol() { return /^[\u4E00-\u9FA50-9a-zA-Z]+$/g; },
    get telephone() { return /^1[34578]\d{9}$/g; }
};
;
exports.ruleArray = {
    min: (value, parameter) => parseInt(value) >= parameter,
    max: (value, parameter) => parseInt(value) <= parameter,
    minLength: (value, parameter) => getLength(value) >= parameter,
    maxLength: (value, parameter) => getLength(value) <= parameter,
};
/**
 * 替换规则集合
 */
exports.replaceArray = {
    number: (value) => {
        return value.replace(/[^0-9]/g, "").replace(/^0+/g, "");
    },
    min: (value) => {
        return value.replace(/[^0-9]/g, "").replace(/^0+/g, "");
    },
    max: (value) => {
        return value.replace(/[^0-9]/g, "").replace(/^0+/g, "");
    }
};
/**
 * 添加验证规则
 *
 * @param {RuleObj} ruleObj
 */
function addRule(ruleObj) {
    exports.messages[ruleObj.key] = ruleObj.messages;
    ruleObj.regExp && (exports.regExpArray[ruleObj.key] = ruleObj.rule);
    ruleObj.rule && (exports.ruleArray[ruleObj.key] = ruleObj.rule);
    ruleObj.replace && (exports.replaceArray[ruleObj.key] = ruleObj.replace);
}
exports.addRule = addRule;
/**
 * 默认验证规则 去除前后空格
 *
 * @param {string} key
 * @returns {RuleFunction}
 */
function replaceDefault(value) {
    return value.replace(/(^\s*)|(\s*$)/g, "");
}
exports.replaceDefault = replaceDefault;
/**
 * 默认验证规则
 *
 * @param {string} key
 * @returns {RuleFunction}
 */
function ruleDefault(key) {
    return (value) => {
        return exports.regExpArray[key].test(value);
    };
}
exports.ruleDefault = ruleDefault;
/**
 * 获取字符串长度 中文 = 1 英文 = 0.5
 *
 * @export
 * @param {string} value
 * @returns {number}
 */
function getLength(value) {
    return value.replace(/[^\x00-\xff]/g, "01").length / 2;
}
exports.getLength = getLength;
});
//# sourceMappingURL=rule.js.map
