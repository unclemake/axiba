define("components/validate/index.js",function(require, exports, module) {
"use strict";
const React = require('react');
const index_1 = require('../input/index');
const rule_1 = require('./rule');
exports.addRule = rule_1.addRule;
exports.getLength = rule_1.getLength;
const index_2 = require('../popover/index');
;
;
/**
 * 验证类
 *
 * @class Validate
 * @extends {React.Component<IValidateProps, IValidateState>}
 */
class Validate extends React.Component {
    constructor() {
        super(...arguments);
        /**
         * 状态
         *
         * @memberOf Validate
         */
        this.state = {
            msg: [],
            validate: true,
            value: this.props.value
        };
    }
    /**
     * 验证事件
     *
     * @private
     * @param {any} e
     * @returns
     *
     * @memberOf Validate
     */
    validate(e) {
        let value = e.target.value;
        let state = this.state;
        state.msg = [];
        state.validate = true;
        //去除前后空格
        state.value = rule_1.replaceDefault(value);
        if (this.props.required) {
            let validate = this.valueValidateSave('required', value);
            this.setState(this.state);
            this.hiddenPopover();
            if (!validate) {
                return;
            }
        }
        else {
            let validate = this.valueValidate('required', value);
            if (!validate) {
                return;
            }
        }
        for (let key in this.props) {
            if (rule_1.messages.hasOwnProperty(key)) {
                state.value = this.valueReplace(key, value);
                let validate = this.valueValidateSave(key, value);
            }
        }
        this.setState(this.state);
        this.hiddenPopover();
    }
    /**
     * 定时隐藏提示框
     *
     * @private
     *
     * @memberOf Validate
     */
    hiddenPopover() {
        clearTimeout(this.hiddenST);
        this.hiddenST = setTimeout(() => {
            this.state.validate = true;
            this.setState(this.state);
        }, 4500);
    }
    /**
     * 输入值 替换
     *
     * @private
     * @param {any} key
     * @param {any} value
     * @returns
     *
     * @memberOf Validate
     */
    valueReplace(key, value) {
        let replaceFunction = rule_1.replaceArray[key];
        if (replaceFunction) {
            return replaceFunction(value);
        }
        else {
            return value;
        }
    }
    /**
     * 验证信息渲染
     *
     * @returns
     *
     * @memberOf Validate
     */
    msgRender() {
        return React.createElement("div", null, this.state.msg.map((value, index) => React.createElement("p", {key: index}, value)));
    }
    /**
     * 验证
     *
     * @param {string} type 验证类型
     * @param {string} value 验证值
     * @returns
     *
     * @memberOf Validate
     */
    valueValidate(type, value) {
        let state = this.state, parameter = this.props[type], rule = rule_1.ruleArray[type] || rule_1.ruleDefault(type), validate = rule(value, parameter);
        return validate;
    }
    /**
     * 验证 --> 保存验证
     *
     * @param {string} type
     * @param {string} value
     * @returns
     *
     * @memberOf Validate
     */
    valueValidateSave(type, value) {
        let state = this.state, msg = rule_1.messages[type], parameter = this.props[type], validate = this.valueValidate(type, value);
        state.validate = state.validate && validate;
        validate || state.msg.push(msg(value, parameter));
        return validate;
    }
    onChange(e) {
        this.state.value = e.target.value;
        this.setState(this.state);
    }
    /**
     * 渲染
     *
     * @returns {JSX.Element}
     *
     * @memberOf Validate
     */
    render() {
        let { props } = this;
        return (React.createElement(index_2.default, {overlayClassName: 'ant-popover-warning', placement: "topLeft", content: this.msgRender(), visible: !this.state.validate}, React.createElement(index_1.default, {value: this.state.value, onChange: this.onChange.bind(this), onBlur: this.validate.bind(this)})));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Validate;
});
//# sourceMappingURL=index.js.map
