import * as React from 'react';
import { Store, createStore, Dispatch } from 'redux';
import { Provider, connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { autobind } from 'core-decorators';

/**
 * react页面默认default 加载组件
 * @class Component
 * @extends {React.Component<any, any>}
 */
interface IPageProps<params, data> {
    router: RouteComponentProps<params>
    data: data
    dispatch: Dispatch<any>
    store: Store<any>
}

@autobind
export class BasePage<params, data> extends React.Component<IPageProps<params, data>, any> {

}

