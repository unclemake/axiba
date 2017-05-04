import * as React from 'react';



let state = {
    text: 0
}

/**
 * react页面默认default 加载组件
 * @class Component
 * @extends {React.Component<any, any>}
 */
export default class Component extends React.Component<any, any> {

    state = state;

    onClick() {
        this.state.text++;
        this.setState(this.state);
    }

    /**
     * 渲染函数
     * @returns jsx
     * @memberOf Component
     */
    render() {
        return (<section className='page-home'>
            <p>
                点击次数:{this.state.text}
            </p>
            <a onClick={this.onClick.bind(this)}>点击</a>
        </section>)
    }
}