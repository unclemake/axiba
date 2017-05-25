import * as React from 'react';
import { Store, createStore, Dispatch } from 'redux';
import { Provider, connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import { BasePage } from '@components/global/baseClass';
import reducer from './reducer';
import { addTodo } from './acitons';
import * as model from './model';
import { autobind } from 'core-decorators';

interface IPageState {
    text: string
};


/**
 * 
 * 子组件
 * @export
 * @class Page
 * @extends {React.Component<any, any>}
 */
@autobind
export default class Page extends React.Component<any, any> {

    render() {
        const { props, state } = this;

        const { data } = props;
        return (<div>
           组件Test
        </div>);
    }
}
