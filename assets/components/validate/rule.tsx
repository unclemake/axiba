export let messages = {
    required: () => "必填！",
    number: (value, parameter) => `请输入正整数！`,
    min: (value, parameter) => `必须大于等于 ${parameter}`,
    max: (value, parameter) => `必须小于等于 ${parameter}`,
    minLength: (value, parameter) => `长度必须大于等于 ${parameter} (两个英文等于1)`,
    maxLength: (value, parameter) => `长度必须大于等于 ${parameter} (两个英文等于1)`,
    noSymbol: (value, parameter) => `必须是中文或英文,数字`,
    telephone: (value, parameter) => `必须是手机号码`,
}

/**
 * 正则集合
 */
export let regExpArray = {
    get required() { return /[^\s]/g; },
    get number() { return /^[0-9]\d*$/g; },
    get noSymbol() { return /^[\u4E00-\u9FA50-9a-zA-Z]+$/g; },
    get telephone() { return /^1[34578]\d{9}$/g; }
}

/**
 * 验证规则集合
 */
export interface RuleFunction {
    (value: string, parameter?: any): boolean
};
export let ruleArray: { [key: string]: RuleFunction } = {
    min: (value: string, parameter) => parseInt(value) >= parameter,
    max: (value: string, parameter) => parseInt(value) <= parameter,
    minLength: (value: string, parameter) => getLength(value) >= parameter,
    maxLength: (value: string, parameter) => getLength(value) <= parameter,
}



/**
 * 替换规则集合
 */
export let replaceArray = {
    number: (value: string) => {
        return value.replace(/[^0-9]/g, "").replace(/^0+/g, "");
    },
    min: (value: string) => {
        return value.replace(/[^0-9]/g, "").replace(/^0+/g, "");
    },
    max: (value: string) => {
        return value.replace(/[^0-9]/g, "").replace(/^0+/g, "");
    }
}



/**
 * 验证规则 类型
 * 
 * @export
 * @interface RuleObj
 */
export interface RuleObj {
    key: string,
    messages: (value: string, parameter) => string,
    regExp?: RegExp,
    rule?: RuleFunction
    replace?: (value: string) => string
}


/**
 * 添加验证规则
 * 
 * @param {RuleObj} ruleObj
 */
export function addRule(ruleObj: RuleObj) {
    messages[ruleObj.key] = ruleObj.messages;

    ruleObj.regExp && (regExpArray[ruleObj.key] = ruleObj.rule);
    ruleObj.rule && (ruleArray[ruleObj.key] = ruleObj.rule);
    ruleObj.replace && (replaceArray[ruleObj.key] = ruleObj.replace);
}

/**
 * 默认验证规则 去除前后空格
 * 
 * @param {string} key
 * @returns {RuleFunction}
 */
export function replaceDefault(value: string) {
    return value.replace(/(^\s*)|(\s*$)/g, "");
}


/**
 * 默认验证规则
 * 
 * @param {string} key
 * @returns {RuleFunction}
 */
export function ruleDefault(key: string): RuleFunction {
    return (value) => {
        return regExpArray[key].test(value);
    }
}


/**
 * 获取字符串长度 中文 = 1 英文 = 0.5
 * 
 * @export
 * @param {string} value
 * @returns {number}
 */
export function getLength(value: string): number {
    return value.replace(/[^\x00-\xff]/g, "01").length / 2;
}
