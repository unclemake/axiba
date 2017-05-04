import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    HashRouter as Router,
    Route,
    Link,
    Redirect
} from 'react-router-dom';

import Nav from '../nav/index';


declare let require: any;
declare let __md5Array: { path: string, md5: string }[];


interface IRequireEnsureProps { url: string };
interface IRequireEnsureState { };
class RequireEnsure extends React.Component<IRequireEnsureProps, IRequireEnsureState> {

    state = {
        page: <div></div>
    }

    async requireEnsure(url) {
        let obj = await require.ensure(url);
        let Page = obj['default'];
        this.state.page = <Page />;
        this.setState(this.state);
    }

    public render(): JSX.Element {
        let { props, state } = this;
        return state.page;
    }

    componentDidMount() {
        this.requireEnsure(this.props.url)
    }
}


export default class AppRouter extends React.Component<any, any> {

    requireEnsure(url) {
        return () => <RequireEnsure url={url} />
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

