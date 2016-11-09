import * as React from 'react';
import Input from '../input/index';
import Popover from '../popover/index';
import InputNumber from '../input-number/index';
import { InputProps } from 'antd/lib/input/Input';

/**
* 获取字符串长度 中文 = 2 英文 = 1
*/
export function getLength(value: string): number {
    return value.replace(/[^\x00-\xff]/g, "01").length / 2;
};

let messages = {
    required: "必填!"
}


let regExpArray = {
    required:  /^\s*$/g,
}


interface RuleFunction {
    (value, parameter): boolean
};

let ruleArray: { [key: string]: RuleFunction } = {
    required: (value) => {
        return value != "" && !regExpArray.required.test(value);
    }
}


interface IValidateProps extends InputProps {
    required?: boolean
    min?: number,
    max?: number
};
interface IValidateState {
    msg: string[],
    validate: boolean
};


class Validate extends React.Component<IValidateProps, IValidateState> {

    state = {
        msg: [],
        validate: true
    }

    validate(e) {
        let value = e.target.value;
        let state = this.state;
        state.msg = [];
        state.validate = true;

        if (this.props.required) {
            let validate = this.valueValidate('required', value);
            state.validate = state.validate && validate;
            validate || state.msg.push(messages['required']);
            this.setState(this.state);
            return;
        }

        this.setState(this.state);
    }


    msgRender() {
        return <div>{
            this.state.msg.map((value, index) => <p key={index}>{value}</p>)
        }</div>;
    }

    valueValidate(type: string, value) {
        let parameter = this.props[type],
            rule = ruleArray[type],
            msg = messages[type];
        return rule(value, parameter);
    }


    public render(): JSX.Element {
        let {props} = this;
        return (<Popover overlayClassName='ant-popover-warning' placement="topLeft" content={this.msgRender()} visible={!this.state.validate}>
            {
                (props.max || props.min) ?
                    <InputNumber min={props.min} max={props.max} defaultValue={3} onBlur={this.validate.bind(this)} /> :
                    <Input {...this.props} onBlur={this.validate.bind(this)} />
            }
        </Popover >);
    }
}

export default Validate;
