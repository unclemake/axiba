define("pages/antd/index.js",["react","@components/antd/index","core-decorators"],function(require, exports, module) {
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const index_1 = require("@components/antd/index");
const core_decorators_1 = require("core-decorators");
let state = {
    text: 0
};
/**
 *
 * antd
 * @export
 * @class Component
 * @extends {React.Component<any, any>}
 */
let Component = class Component extends React.Component {
    /**
     * 点击事件
     *
     *
     * @memberOf Component
     */
    onClick() {
        index_1.message.info('This is a normal message');
    }
    /**
     * 渲染函数
     * @returns jsx
     * @memberOf Component
     */
    render() {
        return (React.createElement("section", { className: 'page-home' },
            React.createElement(index_1.Button, { onClick: this.onClick }, "\u70B9\u51FB")));
    }
};
Component = __decorate([
    core_decorators_1.autobind
], Component);
exports.default = Component;
});
//# sourceMappingURL=index.js.map
