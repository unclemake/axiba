/**
* 预约中心
*/
import * as React from 'react';
import { Provider } from 'react-redux';
import { Store, createStore, Dispatch, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { frootReducer } from './reducer';
import Component from './component';


//创建store
const store: Store<any> = createStore(frootReducer, applyMiddleware(thunk));


//渲染
export default class App extends React.Component<void, void> {
    render() {
        return <Provider store={store}>
            <Component />
        </Provider>
    }
}


