import * as React from 'react';
import { Store, createStore, Dispatch } from 'redux';
import { Provider, connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import { BasePage } from '@components/global/baseClass';
import reducer from './reducer';
import { addTodo } from './acitons';
import * as model from './model';
import Test from './test';
import { autobind } from 'core-decorators';

interface IPageState {
    text: string
};


@autobind
export default class Page extends BasePage<void, model.Todo[]> {

    state: IPageState = {
        text: ''
    }

    onChange(e) {
        let target: HTMLButtonElement = e.target;
        this.state.text = target.value;
    }

    onClick() {
        const { dispatch } = this.props;
        dispatch(addTodo(this.state.text));
    }

    render() {
        const { props, state } = this;

        const { data } = props;
        return (<div>
            <div>
                <input type="text" onChange={this.onChange} />
                <a onClick={this.onClick}>添加</a>
            </div>
            <ul>
                {data.map(data => <li>{data.text}</li>)}
            </ul>
            <Test></Test>
        </div>);
    }
}
export { reducer };
