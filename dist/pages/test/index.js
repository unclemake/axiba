define("pages/test/index.js",["react"],function(require, exports, module) {
const React = require('react');
let state = {
    text: 0
};
/**
 * react页面默认default 加载组件
 * @class Component
 * @extends {React.Component<any, any>}
 */
class Component extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = state;
    }
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
        return (React.createElement("section", {className: 'page-home'}, React.createElement("p", null, "点击次数:", this.state.text), React.createElement("a", {onClick: this.onClick.bind(this)}, "点击")));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component;
});
//# sourceMappingURL=index.js.map
