import '../../components/antd/Menu/style/index.css';

import * as React from 'react';
import { Router, Route, IndexRoute, Link, IndexLink, Redirect } from 'react-router';
import { Menu } from 'antd';


export default class Component extends React.Component<any, void> {
    render() {
        return <Menu theme="dark" mode="horizontal" style={{ lineHeight: '64px' }}>
            <Menu.Item key="1"><Link to="/react">react</Link></Menu.Item>
            <Menu.Item key="3"><Link to="/antd">antd</Link></Menu.Item>
            <Menu.Item key="2"><Link to="/redux">redux</Link></Menu.Item>
            <Menu.Item key="4"><Link to="/ajax">ajax</Link></Menu.Item>
            <Menu.Item ><Link to="/redux2">text</Link></Menu.Item>
        </Menu>
    }
}
