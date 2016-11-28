define("components/validate/rule.js",function(require, exports, module) {
"use strict";

exports.messages = {
    required: function required() {
        return "必填！";
    },
    number: function number(value, parameter) {
        return "\u8BF7\u8F93\u5165\u6B63\u6574\u6570\uFF01";
    },
    min: function min(value, parameter) {
        return "\u5FC5\u987B\u5927\u4E8E\u7B49\u4E8E " + parameter;
    },
    max: function max(value, parameter) {
        return "\u5FC5\u987B\u5C0F\u4E8E\u7B49\u4E8E " + parameter;
    },
    minLength: function minLength(value, parameter) {
        return "\u957F\u5EA6\u5FC5\u987B\u5927\u4E8E\u7B49\u4E8E " + parameter + " (\u4E24\u4E2A\u82F1\u6587\u7B49\u4E8E1)";
    },
    maxLength: function maxLength(value, parameter) {
        return "\u957F\u5EA6\u5FC5\u987B\u5927\u4E8E\u7B49\u4E8E " + parameter + " (\u4E24\u4E2A\u82F1\u6587\u7B49\u4E8E1)";
    },
    noSymbol: function noSymbol(value, parameter) {
        return "\u5FC5\u987B\u662F\u4E2D\u6587\u6216\u82F1\u6587,\u6570\u5B57";
    },
    telephone: function telephone(value, parameter) {
        return "\u5FC5\u987B\u662F\u624B\u673A\u53F7\u7801";
    }
};
/**
 * 正则集合
 */
exports.regExpArray = {
    get required() {
        return (/[^\s]/g
        );
    },
    get number() {
        return (/^[0-9]\d*$/g
        );
    },
    get noSymbol() {
        return (/^[\u4E00-\u9FA50-9a-zA-Z]+$/g
        );
    },
    get telephone() {
        return (/^1[34578]\d{9}$/g
        );
    }
};
;
exports.ruleArray = {
    min: function min(value, parameter) {
        return parseInt(value) >= parameter;
    },
    max: function max(value, parameter) {
        return parseInt(value) <= parameter;
    },
    minLength: function minLength(value, parameter) {
        return getLength(value) >= parameter;
    },
    maxLength: function maxLength(value, parameter) {
        return getLength(value) <= parameter;
    }
};
/**
 * 替换规则集合
 */
exports.replaceArray = {
    number: function number(value) {
        return value.replace(/[^0-9]/g, "").replace(/^0+/g, "");
    },
    min: function min(value) {
        return value.replace(/[^0-9]/g, "").replace(/^0+/g, "");
    },
    max: function max(value) {
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
    return function (value) {
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
