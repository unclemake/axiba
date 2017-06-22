define("pages/error/index.js",["react"],function(require, exports, module) {
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
/**
 * 错误页面
 * antd
 * @export
 * @class Component
 * @extends {React.Component<any, any>}
 */
class Component extends React.Component {
    /**
     * 渲染函数
     * @returns jsx
     * @memberOf Component
     */
    render() {
        return (React.createElement("section", { className: 'page-home' },
            React.createElement("p", null, "404")));
    }
}
exports.default = Component;
});
//# sourceMappingURL=index.js.map
