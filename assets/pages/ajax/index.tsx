import * as React from 'react';
import { get, post } from '../../components/ajax/index';


export default class Component extends React.Component<any, any> {

    state = {
        text: ''
    }



    async getAjax() {

        let res = get('assets/components/nav/index.tsx').then(res => {
            this.state.text = res.data as string;
            this.setState(this.state);
            console.log('调用第一次');
        });
        
        get('assets/components/nav/index.tsx').then(res => {
            this.state.text = res.data as string;
            this.setState(this.state);
            console.log('调用第二次');
        });
    }

    async getAjax1() {
        let res = await get('assets/components/nav/index.tsx', null, 1)
        get('assets/components/nav/index.tsx', null, 1).then(res => {
            this.state.text = res.data as string;
            this.setState(this.state);
            console.log('调用第二次');
        });
    }


    async getAjax2() {
        let res = get('assets/components/nav/index.tsx', null, 2).then(res => {
            this.state.text = res.data as string;
            this.setState(this.state);
            console.log('调用第一次');
        });

        get('assets/components/nav/index.tsx', null, 2).then(res => {
            this.state.text = res.data as string;
            this.setState(this.state);
            console.log('调用第二次');
        });
    }


    render() {
        return <section className='page-home'>
            <h2>简单例子55</h2>
            <div>
                <a onClick={this.getAjax.bind(this)}>get0</a>&nbsp;&nbsp;
                <a onClick={this.getAjax1.bind(this)}>get1</a>&nbsp;&nbsp;
                <a onClick={this.getAjax2.bind(this)}>get2</a>&nbsp;&nbsp;
            </div>
            <p>
                {this.state.text}
            </p>
        </section>
    }
}

