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
            <h2>未找到页面</h2>
        </section>
    }
}
