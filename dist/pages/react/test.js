define("pages/react/test.js",["react","core-decorators"],function(require, exports, module) {
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const core_decorators_1 = require("core-decorators");
;
/**
 *
 * 子组件
 * @export
 * @class Page
 * @extends {React.Component<any, any>}
 */
let Page = class Page extends React.Component {
    render() {
        const { props, state } = this;
        const { data } = props;
        return (React.createElement("div", null, "\u7EC4\u4EF6Test"));
    }
};
Page = __decorate([
    core_decorators_1.autobind
], Page);
exports.default = Page;
});
//# sourceMappingURL=test.js.map
