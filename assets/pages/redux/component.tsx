/**
* 预约中心
*/
import * as React from 'react';
import { Dispatch } from 'redux';
import Button from '../../components/button/index';
import Input from '../../components/input/index';

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
            <Input placeholder="填写" value={this.state.str} onChange={this.change.bind(this)}></Input>
            <Button onClick={() => dispatch(action.addStr(this.state.str))} >添加</Button>
            <h3>列表</h3>
            <ul>
                {state.list.map(value => <li key={value} >{value}</li>)}
            </ul>
            <h3>样式</h3>
            <p className="css1">
                样式
            </p>
        </section >
    }
}


//导出
const mapStateToProps = state => state;
export default connect(mapStateToProps)(App);