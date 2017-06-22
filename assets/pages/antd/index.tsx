import * as React from 'react';
import { Button,message } from '@components/antd/index';
import { autobind } from 'core-decorators';


let state = {
    text: 0
}


/**
 * 
 * antd
 * @export
 * @class Component
 * @extends {React.Component<any, any>}
 */
@autobind
export default class Component extends React.Component<any, any> {

    /**
     * 点击事件
     * 
     * 
     * @memberOf Component
     */
    onClick() {
       message.info('This is a normal message');
    }

    /**
     * 渲染函数
     * @returns jsx
     * @memberOf Component
     */
    render() {
        return (<section className='page-home'>
            <Button onClick={this.onClick}>点击</Button>
        </section>)
    }
}