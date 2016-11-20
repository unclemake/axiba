import * as React from 'react';
import { get, post } from '../../components/ajax/index';
import Button from '../../components/button/index';


/**
 * ajax demo
 * 
 * @export
 * @class Component
 * @extends {React.Component<any, any>}
 */
export default class Component extends React.PureComponent<any, any> {

    /**
     * 状态保存log
     * 
     * 
     * @memberOf Component
     */
    state = {
        text: []
    }

    /**
     * log输出
     * 
     * @param {any} msg
     * 
     * @memberOf Component
     */
    log(msg) {
        this.state.text.push(msg);
        this.setState(this.state);
    }

    /**
     * 第一个按钮
     * 
     * 
     * @memberOf Component
     */
    async getAjax() {
        this.log('默认400毫秒只能调用一次');
        this.log('调用第一次');
        /**
         * 
         * 
         * @param {any} res
         */
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

    /**
     * 第二个按钮
     * 当按钮点击事件 返回的是 Promise 会有个loading
     * @returns
     * 
     * @memberOf Component
     */
    async getAjax1() {
        this.log('缓存');
        this.log('调用第一次');
        let res = await get('assets/components/nav/index.tsx', null, 1)
        this.log('调用第一次成功');
        this.log('调用第二次');
        return get('assets/components/nav/index.tsx', null, 1).then(res => {
            this.log('调用第二次成功');
            this.log('-------');
        });
    }


    /**
     * 第三个按钮 
     * 当按钮点击事件 返回的是 Promise 会有个loading
     * @returns
     * 
     * @memberOf Component
     */
    async getAjax2() {
        this.log('延迟提交 400ms 只提交最后一次ajax');
        this.log('调用第一次');
        /**
         * 
         * 
         * @param {any} res
         */
        let res = get('assets/components/nav/index.tsx', null, 2).then(res => {
            this.log('调用第一次成功');
        });
        this.log('调用第二次');
        return get('assets/components/nav/index.tsx', null, 2).then(res => {
            this.log('调用第二次成功');
            this.log('-------');
        });
    }


    /**
     * 渲染
     * 
     * @returns
     * 
     * @memberOf Component
     */
    render() {
        return <section className='page-home'>
            <h2>简单例子55</h2>
            <div>
                <Button onClick={this.getAjax.bind(this)}>get1</Button>
                <Button onClick={this.getAjax1.bind(this)}>get2</Button>
                <Button onClick={this.getAjax2.bind(this)}>get3</Button>
            </div>
            {this.state.text.map((value, index) => {
                return <p key={index}>{value}</p>;
            })}
        </section>
    }
}

