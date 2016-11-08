import * as React from 'react';
import { get, post } from '../../components/ajax/index';


export default class Component extends React.Component<any, any> {

    state = {
        text: ''
    }


    getAjax() {
        get('assets/components/nav/index.tsx').then(res => {
            this.state.text = res.data as string;
            this.setState(this.state);
            console.log('get调用结束1');
        })
        return get('assets/components/nav/index.tsx').then(res => {
            this.state.text = res.data as string;
            this.setState(this.state);
            console.log('get调用结束');
        })
    }

    render() {
        return <section className='page-home'>
            <h2>简单例子55</h2>
            <div>
                <a onClick={this.getAjax.bind(this)}>get</a>&nbsp;&nbsp;
            </div>
            <p>
                {this.state.text}
            </p>
        </section>
    }
}

