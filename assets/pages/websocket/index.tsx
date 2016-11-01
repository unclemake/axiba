import * as React from 'react';

export default class Component extends React.Component<any, any> {
    btnClick() {
        this.setState({
            text: "1",
            text2: 'text2'
        });
    }

    render() {
        const {state} = this;
        return <section className="page=home">
            <h2>简单例子1444</h2>
            <div>
                <a onClick={this.btnClick.bind(this)} className="ant-btn">点我</a>
            </div>
        </section>
    }
}
