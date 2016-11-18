import * as React from 'react';
import { Router, Route, IndexRoute, Link, IndexLink, Redirect } from 'react-router';
import './index.css'

export default class Component extends React.PureComponent<any, void> {
    render() {
        return <nav className='nav'>
            <Link to="/react">react</Link>
            <Link to="/antd">antd</Link>
            <Link to="/redux">redux</Link>
            <Link to="/ajax">ajax</Link>
            <Link to="/test">test</Link>
        </nav>
    }
}
