import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    HashRouter as Router,
    Route,
    Link,
    Redirect,
    Switch,
    RouteComponentProps
} from 'react-router-dom';

import Nav from '../nav/index';
import { Provider, connect } from 'react-redux';
import { Store, createStore, Dispatch, combineReducers } from 'redux';
import { autobind } from 'core-decorators';
import { Spin } from '../antd/index';

declare let require: any;

// 缓存页面数据
let saveState = {};
// acitons 列表
let acitonsList: { [key: string]: any } = {};
/**
 * 获取strie
 * 
 * @returns
 */
function getStore() {
    const rootReducer = combineReducers(acitonsList);
    const store: Store<any> = createStore(rootReducer, saveState);
    return store;
}

interface IRequireEnsureProps { url: string, router: RouteComponentProps<any> };
interface IRequireEnsureState { };
@autobind
class RequireEnsure extends React.Component<IRequireEnsureProps, IRequireEnsureState> {
    state = {
        page: <div></div>,
        loading: true
    }

    async requireEnsure(url) {
        // <debug>
        // 此行会在发布中删除
        console.log(url);
        // </debug>

        this.state.loading = true;
        this.setState(this.state);

        let path = this.props.router.match.path;
        let obj = await require.ensure(url);
        // 获取页面
        let Page = obj['default'];
        // 获取reducer
        acitonsList[path] = obj['reducer'];
        const store: Store<any> = getStore();
        const mapStateToProps: any = state => {
            // 保存每个页面的state
            saveState = state;
            return ({
                data: state[path]
            })
        };

        // 提取data
        let App = connect(mapStateToProps)(Page) as typeof Page;
        this.state.page = <Provider store={store}>
            <App router={this.props.router} store={store} />
        </Provider>;
        this.state.loading = false;
        this.setState(this.state);
    }

    public render(): JSX.Element {
        let { props, state } = this;
        return state.loading ? <div style={{ textAlign: 'center', paddingTop: '100px' }}><Spin /></div> : state.page;
    }

    /**
     * 重加载
     * 
     * @param {any} url
     * @returns
     * 
     * @memberOf RequireEnsure
     */
    async reload(url) {
        if (url === 'dist/index.js') {
            window.location.reload();
            return;
        }
        let bl = await window['axibaModular'].reload(url);
        if (bl) {
            if (url !== this.props.url) {
                await window['axibaModular'].reload(this.props.url);
            }
            this.requireEnsure(this.props.url);
        }
    }

    componentWillUpdate(nextProps) {
        if (nextProps.url !== this.props.url) {
            // 渲染完毕再改变 不然this.props.router.match.path值不对
            setTimeout(() => {
                this.requireEnsure(nextProps.url);
            }, 0);
        }
    }
    componentDidMount() {
        this.requireEnsure(this.props.url);
        window['__reload'] = this.reload;
    }
}


export default class AppRouter extends React.Component<any, any> {

    requireEnsure(url) {
        return (props: RouteComponentProps<any>) => <RequireEnsure url={url} router={props} />
    }

    render() {
        let requireEnsure = this.requireEnsure;
        return (
            <Router>
                <section className='h100'>
                    <Nav />
                    <Switch>
                        <Route exact path="/" render={requireEnsure('pages/react/index.js')} />
                        <Route path="/test" render={requireEnsure('pages/test/index.js')} />
                        <Route path="/antd" render={requireEnsure('pages/antd/index.js')} />
                        <Route render={requireEnsure('pages/error/index.js')} />
                    </Switch>
                </section>
            </Router>
        )
    }
}

ReactDOM.render(
    <AppRouter />,
    document.getElementById('app')
);

