import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    HashRouter as Router,
    Route,
    Link,
    Redirect,
    RouteComponentProps
} from 'react-router-dom';

import Nav from '../nav/index';
import { Provider, connect } from 'react-redux';
import { Store, createStore, Dispatch, combineReducers } from 'redux';
import { autobind } from 'core-decorators';

declare let require: any;

// 保存数据
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
    }

    async requireEnsure(url) {
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
        this.setState(this.state);
    }

    public render(): JSX.Element {
        let { props, state } = this;

        return state.page;
    }

    async reload(url) {
        let bl = await window['axibaModular'].reload(url);
        if (bl) {
            if (url !== this.props.url) {
                await window['axibaModular'].reload(this.props.url);
            }
            this.requireEnsure(this.props.url);
        }
    }

    componentDidMount() {
        this.requireEnsure(this.props.url);
        window['__reload'] = this.reload;
    }
}


export default class AppRouter extends React.Component<any, any> {

    requireEnsure(url) {
        return (props: RouteComponentProps<any>) => {
            return <RequireEnsure url={url} router={props} />
        }
    }

    render() {
        let requireEnsure = this.requireEnsure;
        return (
            <Router>
                <section className='h100'>
                    <Nav />
                    <Redirect from='/' to='/react' />
                    <Route path="/react" render={requireEnsure('pages/react/index.js')} />
                    <Route path="/test" render={requireEnsure('pages/test/index.js')} />
                </section>
            </Router>
        )
    }
}

ReactDOM.render(
    <AppRouter />,
    document.getElementById('app')
);

