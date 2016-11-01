import * as React from 'react';
import * as Superagent from 'superagent';


export default class Component extends React.Component<any, any> {

    state = {
        text: ''
    }


    getClick() {
        Superagent.get('assets/components/nav/index.tsx').then(res => {
            this.state.text = res.text;
            this.setState(this.state);
        })
    }

    postClick() {
        Superagent.post('assets/components/nav/index.tsx').then(res => {
            this.state.text = res.text;
            this.setState(this.state);
        })
    }

    render() {
        const {state} = this;
        return <section className="page=home">
            <h2>简单例子1</h2>
            <div>
                <a onClick={this.getClick.bind(this)} className="ant-btn">get</a>
                <a onClick={this.postClick.bind(this)} className="ant-btn">post</a>
            </div>
            <p>
                {this.state.text}
            </p>
        </section>
    }
}

