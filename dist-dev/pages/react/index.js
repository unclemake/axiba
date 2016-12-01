define("pages/react/index.js",function(require, exports, module) {
"use strict";
const React = require('react');
/**
 * react页面默认default 加载组件
 * @class Component
 * @extends {React.Component<any, any>}
 */
class Component extends React.PureComponent {
    constructor() {
        super(...arguments);
        /**
         * 状态
         * @memberOf Component
         */
        this.state = {
            btnNu: 1,
            btnText: '点击我',
            component2: 1
        };
    }
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
        const { state } = this;
        return (React.createElement("section", {className: 'page-home'}, 
            React.createElement("p", null, "点击事件的2种绑定方式"), 
            React.createElement("div", null, 
                React.createElement("a", {onClick: this.btnClick.bind(this)}, 
                    state.btnText, 
                    ":", 
                    state.btnNu), 
                "  ", 
                React.createElement("a", {onClick: () => this.changeProps()}, "修改Component2属性")), 
            React.createElement("br", null), 
            React.createElement("br", null), 
            React.createElement("br", null), 
            React.createElement("br", null), 
            React.createElement(Component2, {nu: this.state.component2, type: 'text'})));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component;
/**
 * Component2 组件
 *
 * @class Component2
 * @extends {React.Component<{
 *     nu: number
 * }, any>}
 */
class Component2 extends React.PureComponent {
    constructor() {
        super(...arguments);
        /**
         * 初始化状态
         * @memberOf Component2
         */
        this.state = {
            btnNu: this.props.nu
        };
    }
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
    ReactCompositeComponent() {
        console.log('ReactCompositeComponent');
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
        const { state } = this;
        return React.createElement("section", {className: 'page=home'}, 
            React.createElement("p", null, "组件的创建和调用  react 生命周期"), 
            React.createElement("div", null, 
                React.createElement("input", {type: 'text'}), 
                React.createElement("a", {onClick: this.btnClick.bind(this), className: 'ant-btn'}, 
                    React.createElement("i", {className: 'iconfont icon-home white'}), 
                    "点击:", 
                    state.btnNu)), 
            React.createElement("p", null, 
                "props['nu]: ", 
                this.props.nu));
    }
}
exports.Component2 = Component2;
});
//# sourceMappingURL=index.js.map
