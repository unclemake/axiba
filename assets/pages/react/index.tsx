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
        btnText: '点击我',
        component2: 1
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
     * 改变 component2的props
     * 
     * 
     * @memberOf Component
     */
    changeProps() {
        this.setState({
            component2: this.state.component2 + 1
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
            <p>点击事件的2种绑定方式</p>
            <div>
                <a onClick={this.btnClick.bind(this)}>{state.btnText}:{state.btnNu}</a>&nbsp;&nbsp;
                <a onClick={() => this.changeProps()}>修改Component2属性</a>
            </div>
            <br />
            <br />
            <br />
            <br />
            <Component2 nu={this.state.component2} type='text' />
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
     * 接收到新的props或者state后，进行渲染之前调用，此时不允许更新props或state。
     * 
     * 
     * @memberOf Component2
     */
    componentWillMount() {
        console.log('componentWillMount');
    }

    /**
     * 完成渲染新的props或者state后调用，此时可以访问到新的DOM元素。
     * 
     * 
     * @memberOf Component2
     */
    componentDidMount() {
        console.log('componentDidMount');
    }


    /**
     * 组件接收到新的props时调用，并将其作为参数nextProps使用，此时可以更改组件props及state。
     * 
     * 
     * @memberOf Component2
     */
    componentWillReceiveProps() {
        console.log('componentWillReceiveProps');
    }

    /**
     * 组件是否应当渲染新的props或state，返回false表示跳过后续的生命周期方法，通常不需要使用以避免出现bug。在出现应用的瓶颈时，可通过该方法进行适当的优化。
     * 
     * @returns
     * 
     * @memberOf Component2
     */
    shouldComponentUpdate() {
        console.log('shouldComponentUpdate');
        return true;
    }
    
    /**
     * 销毁&清理期
     * 
     * 
     * @memberOf Component2
     */
    componentWillUnmount() { 
        console.log('componentWillUnmount');
    }
    /**
     * 渲染
     * @returns jsx
     * @memberOf Component2
     */
    render() {
        const {state} = this;
        return <section className='page=home'>
            <p>组件的创建和调用  react 生命周期</p>
            <div>
                <input type='text' />
                <a onClick={this.btnClick.bind(this)} className='ant-btn'>
                    <i className='iconfont icon-home white'></i>
                    点击:{state.btnNu}</a>
            </div>
            <p>
                props['nu]: {this.props.nu}
            </p>
        </section>;
    }
}
