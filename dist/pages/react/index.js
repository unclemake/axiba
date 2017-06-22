define("pages/react/index.js",["react","@components/global/baseClass","./reducer","./acitons","./test","core-decorators","./index.css"],function(require, exports, module) {
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const baseClass_1 = require("@components/global/baseClass");
const reducer_1 = require("./reducer");
exports.reducer = reducer_1.default;
const acitons_1 = require("./acitons");
const test_1 = require("./test");
const core_decorators_1 = require("core-decorators");
require("./index.css");
;
/**
 *
 * react页面
 * @export
 * @class Page
 * @extends {BasePage<void, model.Todo[]>}
 */
let Page = class Page extends baseClass_1.BasePage {
    /**
     *
     * react页面
     * @export
     * @class Page
     * @extends {BasePage<void, model.Todo[]>}
     */
    constructor() {
        super(...arguments);
        /**
         * state
         *
         * @type {IPageState}
         * @memberOf Page
         */
        this.state = {
            text: ''
        };
    }
    /**
     * input改变事件
     *
     * @param {any} e
     *
     * @memberOf Page
     */
    onChange(e) {
        let target = e.target;
        this.state.text = target.value;
    }
    /**
     * 点击事件
     *
     *
     * @memberOf Page
     */
    onClick() {
        const { dispatch } = this.props;
        dispatch(acitons_1.addTodo(this.state.text));
    }
    /**
     * 页面渲染
     *
     * @returns
     *
     * @memberOf Page
     */
    render() {
        const { props, state } = this;
        const { data } = props;
        return (React.createElement("div", { className: 'page-react', ref: '111' },
            React.createElement("div", { style: { marginTop: '20px' } },
                React.createElement("input", { type: "text", onChange: this.onChange }),
                React.createElement("a", { onClick: this.onClick.bind(this) }, "\u6DFB\u52A0")),
            React.createElement("ul", null, data.map(data => React.createElement("li", null, data.text))),
            React.createElement("div", { className: 'error-color' },
                React.createElement(test_1.default, null))));
    }
};
Page = __decorate([
    core_decorators_1.autobind
], Page);
exports.default = Page;
});
//# sourceMappingURL=index.js.map
