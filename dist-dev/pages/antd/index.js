define("pages/antd/index.js",function(require, exports, module) {
"use strict";
const React = require('react');
const index_1 = require('../../components/button/index');
const index_2 = require('../../components/select/index');
const index_3 = require('../../components/input/index');
const index_4 = require('../../components/tree/index');
const index_5 = require('../../components/date-picker/index');
const index_6 = require('../../components/notification/index');
const index_7 = require('../../components/validate/index');
let TreeNode = index_4.default.TreeNode;
index_7.addRule({
    key: 'gan',
    messages: () => '必须 = 你好',
    rule: (value, parameter) => value === '你好',
});
const Option = index_2.default.Option;
class Component extends React.PureComponent {
    render() {
        return React.createElement("section", {className: "page=home"}, 
            React.createElement("h2", null, "插件"), 
            React.createElement("ul", null, 
                React.createElement("li", null, 
                    React.createElement("h3", null, "按钮"), 
                    React.createElement(index_1.default, null, "Hello world!")), 
                React.createElement("li", null, 
                    React.createElement("h3", null, "下拉框"), 
                    React.createElement(index_2.default, {size: "large", defaultValue: "lucy", style: { width: 200 }, onChange: handleChange}, 
                        React.createElement(Option, {value: "jack"}, "Jack"), 
                        React.createElement(Option, {value: "lucy"}, "Lucy"), 
                        React.createElement(Option, {value: "disabled", disabled: true}, "Disabled"), 
                        React.createElement(Option, {value: "yiminghe"}, "Yiminghe"))), 
                React.createElement("li", null, 
                    React.createElement("h3", null, "输入框"), 
                    React.createElement(index_3.default, null)), 
                React.createElement("li", null, 
                    React.createElement("h3", null, "弹窗"), 
                    React.createElement(index_1.default, {onClick: () => index_6.success({
                        message: '你好',
                        description: 'success'
                    })}, "success"), 
                    React.createElement(index_1.default, {onClick: () => index_6.error({
                        message: '你好',
                        description: 'error'
                    })}, "error")), 
                React.createElement("li", null, 
                    React.createElement("h3", null, "时间"), 
                    React.createElement(index_5.default, null)), 
                React.createElement("li", null, 
                    React.createElement("h3", null, "树"), 
                    React.createElement(index_4.default, {className: "myCls"}, 
                        React.createElement(TreeNode, {title: "parent 1", key: "0-0"}, 
                            React.createElement(TreeNode, {title: "parent 1-0", key: "0-0-0", disabled: true}, 
                                React.createElement(TreeNode, {title: "leaf", key: "0-0-0-0", disableCheckbox: true}), 
                                React.createElement(TreeNode, {title: "leaf", key: "0-0-0-1"})), 
                            React.createElement(TreeNode, {title: "parent 1-1", key: "0-0-1"}, 
                                React.createElement(TreeNode, {title: React.createElement("span", {style: { color: '#08c' }}, "sss"), key: "0-0-1-0"})
                            ))
                    ))), 
            React.createElement("h2", null, "验证插件"), 
            React.createElement("div", null, 
                React.createElement("h3", null, "字符串长度 大小=>10 =<20"), 
                React.createElement(index_7.default, {required: true, min: 10, max: 20})), 
            React.createElement("div", null, 
                React.createElement("h3", null, "字符串长度 最短10 最长12"), 
                React.createElement(index_7.default, {required: true, minLength: 10, maxLength: 12})), 
            React.createElement("div", null, 
                React.createElement("h3", null, "只能输入英文和数字和中文"), 
                React.createElement(index_7.default, {noSymbol: true})), 
            React.createElement("div", null, 
                React.createElement("h3", null, "手机号码"), 
                React.createElement(index_7.default, {telephone: true})), 
            React.createElement("div", null, 
                React.createElement("h3", null, "自定义规则"), 
                React.createElement(index_7.default, {gan: true}), 
                React.createElement("code", null, `addRule({
                        key: 'gan',
                        messages: () => '必须 = 你好',
                        rule: (value, parameter) => value === '你好',
                    })`)));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component;
function handleChange(value) {
    console.log(`selected ${value}`);
}
});
//# sourceMappingURL=index.js.map
