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
import './index.css';

interface IPageState {
    text: string
};


/**
 * 
 * react页面
 * @export
 * @class Page
 * @extends {BasePage<void, model.Todo[]>}
 */
@autobind
export default class Page extends BasePage<void, model.Todo[]> {

    /**
     * state
     * 
     * @type {IPageState}
     * @memberOf Page
     */
    state: IPageState = {
        text: ''
    }

    /**
     * input改变事件
     * 
     * @param {any} e
     * 
     * @memberOf Page
     */
    onChange(e) {
        let target: HTMLButtonElement = e.target;
        this.state.text = target.value;
    }

    /**
     * 点击事件
     * 
     * 
     * @memberOf Page
     */
    onClick() {
        const { dispatch } = this.props;
        dispatch(addTodo(this.state.text));
    }

    /**
     * 页面渲染
     * 
     * @returns
     * 
     * @memberOf Page
     */
    render() {
        const { props, state } = this;
        const { data } = props;
        return (<div className='page-react'>
            <div style={{ marginTop: '20px' }}>
                <input type="text" onChange={this.onChange} />
                <a onClick={this.onClick.bind(this)}>添加</a>
            </div>
            <ul>
                {data.map(data => <li>{data.text}</li>)}
            </ul>
            <div className='error-color'>
                 <Test></Test>
            </div>
        </div>);
    }
}
export { reducer };
