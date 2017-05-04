define("pages/react/index.js",["react"],function(require, exports, module) {
const React = require('react');
/**
 * react页面默认default 加载组件
 * @class Component
 * @extends {React.Component<any, any>}
 */
class Component extends React.PureComponent {
    /**
     * 渲染函数
     * @returns jsx
     * @memberOf Component
     */
    render() {
        const { state } = this;
        return (React.createElement("section", {className: 'page-home'}, "react"));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component;
});
//# sourceMappingURL=index.js.map
