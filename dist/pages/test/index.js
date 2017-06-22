define("pages/test/index.js",["react"],function(require, exports, module) {
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
let state = {
    text: 0
};
/**
 * react页面默认default 加载组件
 * @class Component
 * @extends {React.Component<any, any>}
 */
class Component extends React.Component {
    constructor() {
        super(...arguments);
        this.state = state;
    }
    onClick() {
        this.state.text++;
        // 每次setState 会创建一个新的state 所以闭包的state 不会在切换页面时保存值
        this.setState(this.state);
    }
    /**
     * 渲染函数
     * @returns jsx
     * @memberOf Component
     */
    render() {
        return (React.createElement("section", { className: 'page-home' },
            React.createElement("p", null,
                "\u70B9\u51FB\u6B21\u6570:",
                this.state.text),
            React.createElement("a", { onClick: this.onClick.bind(this) }, "\u70B9\u51FB")));
    }
}
exports.default = Component;
});
//# sourceMappingURL=index.js.map
