import * as React from 'react';
import { get, post } from '../../components/ajax/index';


export default class Component extends React.Component<any, any> {

    state = {
        text: []
    }

    log(msg) {
        this.state.text.push(msg);
        this.setState(this.state);
    }

    async getAjax() {
        this.log('默认400毫秒只能调用一次');
        this.log('调用第一次');
        let res = get('assets/components/nav/index.tsx').then(res => {
            this.log('调用第一次成功');
            this.log('-------');
        });

        this.log('调用第二次');
        get('assets/components/nav/index.tsx').then(res => {
            this.setState(this.state);
            this.log('调用第二次成功');
        });
    }

    async getAjax1() {
        this.log('缓存');
        this.log('调用第一次');
        let res = await get('assets/components/nav/index.tsx', null, 1)
        this.log('调用第一次成功');
        this.log('调用第二次');
        get('assets/components/nav/index.tsx', null, 1).then(res => {
            this.log('调用第二次成功');
            this.log('-------');
        });
    }


    async getAjax2() {
        this.log('延迟提交 400ms 只提交最后一次ajax');
        this.log('调用第一次');
        let res = get('assets/components/nav/index.tsx', null, 2).then(res => {
            this.log('调用第一次成功');
        });
        this.log('调用第二次');
        get('assets/components/nav/index.tsx', null, 2).then(res => {
            this.log('调用第二次成功');
            this.log('-------');
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
            {this.state.text.map((value, index) => {
                return <p key={index}>{value}</p>;
            })}
        </section>
    }
}

