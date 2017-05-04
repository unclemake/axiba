import * as React from 'react';

/**
 * react页面默认default 加载组件
 * @class Component
 * @extends {React.Component<any, any>}
 */
export default class Component extends React.PureComponent<any, any> {

    /**
     * 渲染函数
     * @returns jsx
     * @memberOf Component
     */
    render() {
        const { state } = this;
        return (<section className='page-home'>
            react
        </section>)
    }
}

