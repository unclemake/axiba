import * as React from 'react';
import Input from '../input/index';
import { addRule, getLength, messages, regExpArray, ruleDefault, ruleArray, replaceArray, RuleFunction, replaceDefault } from './rule';
import Popover from '../popover/index';
import { InputProps } from 'antd/lib/input/Input';

/**
 * 验证组件 属性
 * 
 * @interface IValidateProps
 * @extends {InputProps}
 */
interface IValidateProps {
    /**
     * 必填
     * 
     * @type {boolean}
     * @memberOf IValidateProps
     */
    required?: boolean
    /**
     * 数值最小值
     * 
     * @type {number}
     * @memberOf IValidateProps
     */
    min?: number
    /**
     * 数值最大值
     * 
     * @type {number}
     * @memberOf IValidateProps
     */
    max?: number
    /**
     * 字符串长度最小值
     * 
     * @type {number}
     * @memberOf IValidateProps
     */
    minLength?: number
    /**
     * 字符串长度最大值
     * 
     * @type {number}
     * @memberOf IValidateProps
     */
    maxLength?: number
    /**
     * 是否开启符号输入
     * 
     * @type {number}
     * @memberOf IValidateProps
     */
    noSymbol?: boolean

    /**
    * 电话
    * 
    * @type {boolean}
    * @memberOf IValidateProps
    */
    telephone?: boolean

    placeholder?: string
    value?: string

    /**
   * 自定义规则
   * 
   * @type {boolean}
   * @memberOf IValidateState
   */
    [key: string]: any
};
/**
 * 状态
 * 
 * @interface IValidateState
 */
interface IValidateState {
    /**
     * 验证信息
     * 
     * @type {string[]}
     * @memberOf IValidateState
     */
    msg: string[],
    /**
     * 验证结果
     * 
     * @type {boolean}
     * @memberOf IValidateState
     */
    validate: boolean


};
/**
 * 验证类
 * 
 * @class Validate
 * @extends {React.Component<IValidateProps, IValidateState>}
 */
class Validate extends React.Component<IValidateProps, IValidateState> {

    /**
     * 状态
     *
     * @memberOf Validate
     */
    state = {
        msg: [],
        validate: true,
        value: this.props.value
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
    private validate(e) {
        let value = e.target.value;
        let state = this.state;
        state.msg = [];
        state.validate = true;
        //去除前后空格
        state.value = replaceDefault(value);

        if (this.props.required) {
            let validate = this.valueValidateSave('required', value);
            this.setState(this.state);
            this.hiddenPopover();
            if (!validate) { return; }
        } else {
            let validate = this.valueValidate('required', value);
            if (!validate) { return; }
        }

        for (let key in this.props) {
            if (messages.hasOwnProperty(key)) {
                state.value = this.valueReplace(key, value);
                let validate = this.valueValidateSave(key, value);
            }
        }

        this.setState(this.state);
        this.hiddenPopover();
    }

    private hiddenST
    /**
     * 定时隐藏提示框
     * 
     * @private
     * 
     * @memberOf Validate
     */
    private hiddenPopover() {
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
    private valueReplace(key, value) {
        let replaceFunction = replaceArray[key];
        if (replaceFunction) {
            return replaceFunction(value);
        } else {
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
    private msgRender() {
        return <div>{
            this.state.msg.map((value, index) => <p key={index}>{value}</p>)
        }</div>;
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
    private valueValidate(type: string, value: string) {
        let state = this.state,
            parameter = this.props[type],
            rule = ruleArray[type] || ruleDefault(type),
            validate = rule(value, parameter);
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
    valueValidateSave(type: string, value: string) {
        let state = this.state,
            msg = messages[type],
            parameter = this.props[type],
            validate = this.valueValidate(type, value);
        state.validate = state.validate && validate;
        validate || state.msg.push(msg(value, parameter));
        return validate;
    }

    private onChange(e) {
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
    public render(): JSX.Element {
        let {props} = this;
        return (<Popover overlayClassName='ant-popover-warning' placement="topLeft" content={this.msgRender()} visible={!this.state.validate}>
            {
                <Input value={this.state.value}
                    onChange={this.onChange.bind(this)}
                    onBlur={this.validate.bind(this)} />
            }
        </Popover >);
    }
}


export { addRule, getLength };
export default Validate;



