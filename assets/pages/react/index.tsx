import * as React from 'react';


/**
 * react页面默认default 加载组件
 * @class Component
 * @extends {React.Component<any, any>}
 */
export default class Component extends React.Component<any, any> {

    /**
     * 状态   
     * @memberOf Component
     */
    state = {
        btnNu: 1,
        btnText: '点击我'
    };


    /**
     * 点击事件 函数
     * @memberOf Component
     */
    btnClick() {
        this.setState({
            btnNu: this.state.btnNu + 1
        });
    }


    /**
     * 渲染函数
     * @returns jsx
     * @memberOf Component
     */
    render() {
        const {state} = this;
        return (<section className='page-home'>
            <h2>简单例子1</h2>
            <div>
                <a onClick={this.btnClick.bind(this)}>{state.btnText}:{state.btnNu}</a>&nbsp;&nbsp;
                <a onClick={() => this.btnClick()}>{state.btnText}:{state.btnNu}</a>
            </div>
            <Component2 nu={10} type='text' />
        </section>)
    }
}


type Component2Props = {
    /**
     * 声明属性 Props
     * @type {number}
     */
    nu: number,
    type?: string
}

type Component2State = {
    /**
     * 声明状态 state
     * @type {number}
     */
    btnNu: number,
    ddd?: string
}

/**
 * Component2 组件
 * 
 * @class Component2
 * @extends {React.Component<{
 *     nu: number
 * }, any>}
 */
export class Component2 extends React.Component<Component2Props, Component2State> {
    /**
     * 初始化状态
     * @memberOf Component2
     */
    state = {
        btnNu: this.props.nu
    };

    /**
     * 点击函数
     * @memberOf Component2
     */
    btnClick() {
        this.setState({
            btnNu: this.state.btnNu + 1,
        });
    }

    /**
     * 渲染
     * @returns jsx
     * @memberOf Component2
     */
    render() {
        const {state} = this;
        return <section className='page=home'>
            <h2>简单例子2</h2>
            <div>
                <input type='text' />

                <a onClick={this.btnClick.bind(this)} className='ant-btn'>
                    <i className='iconfont icon-home white'></i>
                    点击:{state.btnNu}</a>
            </div>
        </section>;
    }
}
