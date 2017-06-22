define("components/nav/index.js",["react","react-router-dom","./index.css"],function(require, exports, module) {
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_router_dom_1 = require("react-router-dom");
require("./index.css");
class Component extends React.PureComponent {
    render() {
        return React.createElement("nav", { className: 'nav' },
            React.createElement(react_router_dom_1.Link, { to: "/" }, "react"),
            React.createElement(react_router_dom_1.Link, { to: "/test" }, "test"),
            React.createElement(react_router_dom_1.Link, { to: "/antd" }, "antd"),
            React.createElement(react_router_dom_1.Link, { to: "/dfadfadf" }, "404"));
    }
}
exports.default = Component;
});
//# sourceMappingURL=index.js.map
