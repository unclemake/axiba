import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, Redirect, hashHistory } from 'react-router';
import Nav from '../../components/nav/index';

declare let require: any;
function async(text) {
    return (location, callback) => {
        console.log('加载：' + text);
        require.async(text, (mod) => {
            var Com = mod.default;
            callback(null, (prop) => {
                return <Main {...prop}><Com /></Main>;
            })
        })
    }
}

class Main extends React.Component<ReactRouter.RouteComponentProps<void, void>, void> {
    render() {
        return <div className="h100">
            <Nav></Nav>
            <main>
                {this.props.children}
            </main>
        </div>;
    }
}


export default class AppRouter extends React.Component<void, void> {

    render() {
        return <Router history={hashHistory}  >
            <Redirect from="/" to="/react" />
            <Route path="/react" getComponents={async('../react/index')} />
            <Route path="/redux" getComponents={async('../redux/index')} />
            <Route path="/antd" getComponents={async('../antd/index')} />

            <Route path="*" getComponents={async('../error/index')} />
        </Router>
    }
}

ReactDOM.render(
    <AppRouter />,
    document.getElementById('app')
);