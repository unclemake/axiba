import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, Redirect, hashHistory } from 'react-router';
import Nav from '../nav/index';
import Progress from '../progress/index';

declare let require: any;



class Main extends React.Component<ReactRouter.RouteComponentProps<void, void>, any> {

    state = {
        loading: true,
        page: <div></div>
    }

    asyncLoading() {
        let props = this.props;
        // 自动解析
        let url = props.route.path === '*' ? '../../pages' + props.location.pathname + '/index' : '../' + props.route.path;
        console.log('加载：' + url);
        require.async(url, (mod) => {
            if (mod) {
                let Com = mod.default;
                this.state.page = <Com />
                this.setState(this.state);
            } else {
                require.async('../../pages/error/index.js', (mod) => {
                    let Com = mod.default;
                    this.state.page = <Com />;
                    this.setState(this.state);
                })
            }
        })
    }

    componentWillReceiveProps(nextProps) {
        let oldLocation = this.props.location;
        let location = nextProps.location;
        
        if (oldLocation.pathname != location.pathname || oldLocation.search !=  location.search) {
            this.asyncLoading();
        }
    }

    componentDidMount() {
        this.asyncLoading();
    }

    render() {
        return <div className='h100'>
            <Nav></Nav>
            <div className="page-loading-box">
            </div>
            <main>
                {this.state.page}
            </main>
        </div>;
    }
}



export default class AppRouter extends React.Component<any, any> {

    async(text) {
        return (obj, callback) => {
            callback(null, (prop) => {
                return <Main {...prop} ></Main>;
            })
        }
    }

    render() {
        return (
            <section className='h100'>
                <Router history={hashHistory}>
                    <Redirect from='/' to='/react' />
                    <Route path='*' component={Main} />
                </Router>
            </section>
        )
    }
}

ReactDOM.render(
    <AppRouter />,
    document.getElementById('app')
);
