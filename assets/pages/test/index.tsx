import * as React from 'react';

export default class Component extends React.PureComponent<any, any> {

    state = {
        text: '点击我',
        text2: 'text2'
    }


    btnClick() {
        this.setState({
            text: '1',
            text2: 'text2'
        });
    }

    render() {
        const {state} = this;
        return <section className='page-home'>
            <h2>代码调试页面</h2>
            <div>
                <a onClick={this.btnClick.bind(this)} className='ant-btn'>点我</a>
            </div>
            <div>
                {this.state.text}
            </div>
            <Component2 text2={state.text2} />
        </section>
    }
}


class Component2 extends React.PureComponent<{
    text2: string
}, any> {
    render() {
        return <section className='page=home'>
            <h2>简单例子2</h2>
            <div>
                {this.props.text2}
            </div>
        </section>
    }
}
