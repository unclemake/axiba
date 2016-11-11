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
            <h2>错误:{this.props.status}</h2>
        </section>
    }
}
