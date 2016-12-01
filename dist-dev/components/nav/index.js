define("components/nav/index.js",function(require, exports, module) {
"use strict";
const React = require('react');
const react_router_1 = require('react-router');
require('./index.css');
class Component extends React.PureComponent {
    render() {
        return React.createElement("nav", {className: 'nav'}, 
            React.createElement(react_router_1.Link, {to: "/react"}, "react"), 
            React.createElement(react_router_1.Link, {to: "/antd"}, "antd"), 
            React.createElement(react_router_1.Link, {to: "/redux"}, "redux"), 
            React.createElement(react_router_1.Link, {to: "/ajax"}, "ajax"), 
            React.createElement(react_router_1.Link, {to: "/test"}, "test"));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component;
});
//# sourceMappingURL=index.js.map
