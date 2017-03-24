import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, Redirect, hashHistory } from 'react-router';
import Nav from '../nav/index';
import Progress from '../progress/index';

declare let require: any;
declare let __md5Array: { path: string, md5: string }[];


class Main extends React.Component<ReactRouter.RouteComponentProps<void, void>, any> {

    state = {
        loading: 0,
        page: <div></div>
    }

    asyncLoading() {
        this.asyncRender = false;

        let props = this.props;
        // 自动解析
        let url = props.route.path === '*' ? 'pages' + props.location.pathname + '/index.js' : 'pages/' + props.route.path + '/index.js';


        if ((window as any).__md5Array) {
            let md5obj = __md5Array.find(value => value.path === url);
            if (md5obj) {
                url = md5obj.md5;
            }
        }

        console.log('加载：' + url);
        this.state.loading = 0;
        this.setState(this.state);

        setTimeout(() => {
            this.state.loading = 1;
            this.setState(this.state);
        }, 0);

        require.async(url, (mod) => {
            this.state.loading = 2;
            if (mod) {
                let Com = mod.default;
                this.state.page = <Com />
                this.setState(this.state);
            } else {
                require.async('../../pages/error/index.js', (mod) => {
                    let Com = mod.default;
                    this.state.page = <Com status={404} />;
                    this.setState(this.state);
                })
            }
        })
    }


    asyncRender = false;
    componentWillReceiveProps(nextProps) {
        let oldLocation = this.props.location;
        let location = nextProps.location;
        if (oldLocation.pathname != location.pathname || oldLocation.search != location.search) {
            this.asyncRender = true;
        }
    }

    componentDidUpdate() {
        if (this.asyncRender) {
            this.asyncLoading();
        }
    }

    componentDidMount() {
        this.asyncLoading();
    }

    getLoadingClass() {
        switch (this.state.loading) {
            case 0:
                return '';
            case 1:
                return 'loading-box-loading';
            case 2:
                return 'loading-box-complete';
        }
    }

    render() {
        return <div className='h100'>
            <Nav></Nav>
            <div className={"loading-box " + this.getLoadingClass()}>
                <div className="loading-box-inner"></div>
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
                    <Route path='dang' component={Main} />
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

