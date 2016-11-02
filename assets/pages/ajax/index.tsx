import * as React from 'react';
import { get, post } from '../../components/ajax/index';


export default class Component extends React.Component<any, any> {

    state = {
        text: ''
    }


    getClick() {
        post('assets/components/nav/index.tsx').then(res => {
            this.state.text = res.text;
            this.setState(this.state);
        })
    }

    postClick() {
        get('assets/components/nav/index.tsx').then(res => {
            this.state.text = res.text;
            this.setState(this.state);
        })
    }

    render() {
        const {state} = this;
        return <section className="page=home">
            <h2>简单例子55</h2>
            <div>
                <a onClick={this.getClick.bind(this)}>get</a>&nbsp;&nbsp;
                <a onClick={this.postClick.bind(this)}>post</a>
            </div>
            <p>
                {this.state.text}
            </p>
        </section>
    }
}

