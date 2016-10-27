import * as React from 'react';


export default class Component extends React.Component<any, any> {

    state = {
        btnText: '点击我',
        btnNu: 1
    }


    btnClick() {
        this.setState({
            btnNu: this.state.btnNu + 1
        });
    }

    render() {
        const {state} = this;
        return <section className="page=home">
            <h2>简单例子1</h2>
            <div>
                <a onClick={this.btnClick.bind(this)} className="ant-btn">{state.btnText}:{state.btnNu}</a>
                <a onClick={() => this.btnClick()} className="ant-btn">{state.btnText}:{state.btnNu}</a>
            </div>
            <Component2 nu={10} />
        </section>
    }
}


class Component2 extends React.Component<{
    nu: number
}, any> {

    state = {
        btnNu: this.props.nu
    }

    btnClick() {
        this.setState({
            btnNu: this.state.btnNu + 1
        });
    }

    render() {
        const {state} = this;
        return <section className="page=home">
            <h2>简单例子2</h2>
            <div>
                <a onClick={this.btnClick.bind(this)} className="ant-btn"><i className="iconfont icon-home white"></i>点击:{state.btnNu}</a>
            </div>
        </section>
    }
}
