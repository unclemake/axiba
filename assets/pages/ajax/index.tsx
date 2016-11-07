import * as React from 'react';
import { get, post } from '../../components/ajax/index';


export default class Component extends React.Component<any, any> {

    state = {
        text: ''
    }

    async getAjax() {
        let res = await get('assets/components/input/index.ts');
        this.state.text = res.text;
        this.setState(this.state);
        console.log('get调用结束');
    }

    getClick() {
        this.getAjax();
        console.log('get');
    }

    postClick() {
        this.postAjax().then(() => {
            console.log('post');
        });
    }

    postAjax() {
        return post('assets/components/nav/index.tsx').then(res => {
            this.state.text = res.text;
            this.setState(this.state);
            console.log('post调用结束');
        })
    }

    render() {
        return <section className='page-home'>
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

