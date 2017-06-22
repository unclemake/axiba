import * as React from 'react';
import { Button } from '@components/antd/index';




/**
 * 错误页面
 * antd
 * @export
 * @class Component
 * @extends {React.Component<any, any>}
 */
export default class Component extends React.Component<any, any> {

    /**
     * 渲染函数
     * @returns jsx
     * @memberOf Component
     */
    render() {
        return (<section className='page-home'>
            <p>
                404
            </p>
        </section>)
    }
}