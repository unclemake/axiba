/**
* 预约中心
*/
import * as React from 'react';
import { Dispatch } from 'redux';
import { Input, Button } from 'antd';
import { connect } from 'react-redux';
import * as action from './action';
import { State } from './model';
import './index.css';

interface AppProps {
    state: State,
    dispatch: Dispatch<any>
}



class App extends React.Component<AppProps, any> {
    state = {
        str: ''
    }
    change(e) {
        this.state.str = e.target.value;
        this.setState(this.state);
    }

    render() {
        const { state, dispatch } = this.props;
        return <section className="page-redux">
            <h2>redux</h2>
            <Input placeholder="Basic usage" value={this.state.str} onChange={this.change.bind(this)}></Input>
            <Button onClick={() => { } }>添加</Button>
            <ul>
                {state.list.map(value => <li>{value}</li>)}
            </ul>
            <p className="red"></p>
        </section>
    }
}


//导出
const mapStateToProps = state => state;
export default connect(mapStateToProps)(App);