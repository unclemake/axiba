import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, Redirect, hashHistory } from 'react-router';
import Nav from '../nav/index';

declare let require: any;
function async(text) {
    return (obj, callback) => {
        // 自动解析
        let url = text === '*' ? '../../pages' + obj.location.pathname + '/index' : '../' + text;

        console.log('加载：' + url);

        // 异步加载
        require.async(url, (mod) => {
            if (mod) {
                let Com = mod.default;
                callback(null, (prop) => {
                    return <Main {...prop}><Com /></Main>;
                })
            } else {
                require.async('../../pages/error/index.js', (mod) => {
                    let Com = mod.default;
                    callback(null, (prop) => {
                        return <Main {...prop}><Com /></Main>;
                    })
                });
            }
        })
    }
}



class Main extends React.Component<ReactRouter.RouteComponentProps<void, void>, void> {
    render() {
        return <div className='h100'>
            <Nav></Nav>
            <main>
                {this.props.children}
            </main>
        </div>;
    }


}


export default class AppRouter extends React.Component<void, void> {

    render() {
        return <Router history={hashHistory}>
            <Redirect from='/' to='/react' />

            <Route path='*' getComponents={async('*')} />
        </Router>
    }
}

ReactDOM.render(
    <AppRouter />,
    document.getElementById('app')
);
