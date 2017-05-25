import * as React from 'react';
import {
    Link
} from 'react-router-dom'
import './index.css'

export default class Component extends React.PureComponent<any, void> {
    render() {
        return <nav className='nav'>
            <Link to="/">react</Link>
            <Link to="/test">test</Link>
            <Link to="/antd">antd</Link>
            <Link to="/dfadfadf">404</Link>
        </nav>
    }
}
