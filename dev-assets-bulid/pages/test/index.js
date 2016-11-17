define("pages/test/index.js",function(require, exports, module) {"use strict";
const React = require('react');
class Component extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            text: '点击我',
            text2: 'text2'
        };
    }
    btnClick() {
        this.setState({
            text: '1',
            text2: 'text2'
        });
    }
    render() {
        const { state } = this;
        return React.createElement("section", {className: 'page-home'}, 
            React.createElement("h2", null, "代码调试页面"), 
            React.createElement("div", null, 
                React.createElement("a", {onClick: this.btnClick.bind(this), className: 'ant-btn'}, "点我")
            ), 
            React.createElement("div", null, this.state.text), 
            React.createElement(Component2, {text2: state.text2}));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component;
class Component2 extends React.Component {
    render() {
        return React.createElement("section", {className: 'page=home'}, 
            React.createElement("h2", null, "简单例子2"), 
            React.createElement("div", null, this.props.text2));
    }
}
});
//# sourceMappingURL=index.js.map
