define("pages/antd/index.js",["react","../../components/button/index","../../components/select/index","../../components/input/index","../../components/tree/index","../../components/date-picker/index","../../components/notification/index","../../components/validate/index"],function(require, exports, module) {
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var index_1 = require('../../components/button/index');
var index_2 = require('../../components/select/index');
var index_3 = require('../../components/input/index');
var index_4 = require('../../components/tree/index');
var index_5 = require('../../components/date-picker/index');
var index_6 = require('../../components/notification/index');
var index_7 = require('../../components/validate/index');
var TreeNode = index_4.default.TreeNode;
index_7.addRule({
    key: 'gan',
    messages: function messages() {
        return '必须 = 你好';
    },
    rule: function rule(value, parameter) {
        return value === '你好';
    }
});
var Option = index_2.default.Option;

var Component = function (_React$PureComponent) {
    _inherits(Component, _React$PureComponent);

    function Component() {
        _classCallCheck(this, Component);

        return _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).apply(this, arguments));
    }

    _createClass(Component, [{
        key: 'render',
        value: function render() {
            return React.createElement("section", { className: "page=home" }, React.createElement("h2", null, "插件"), React.createElement("ul", null, React.createElement("li", null, React.createElement("h3", null, "按钮"), React.createElement(index_1.default, null, "Hello world!")), React.createElement("li", null, React.createElement("h3", null, "下拉框"), React.createElement(index_2.default, { size: "large", defaultValue: "lucy", style: { width: 200 }, onChange: handleChange }, React.createElement(Option, { value: "jack" }, "Jack"), React.createElement(Option, { value: "lucy" }, "Lucy"), React.createElement(Option, { value: "disabled", disabled: true }, "Disabled"), React.createElement(Option, { value: "yiminghe" }, "Yiminghe"))), React.createElement("li", null, React.createElement("h3", null, "输入框"), React.createElement(index_3.default, null)), React.createElement("li", null, React.createElement("h3", null, "弹窗"), React.createElement(index_1.default, { onClick: function onClick() {
                    return index_6.success({
                        message: '你好',
                        description: 'success'
                    });
                } }, "success"), React.createElement(index_1.default, { onClick: function onClick() {
                    return index_6.error({
                        message: '你好',
                        description: 'error'
                    });
                } }, "error")), React.createElement("li", null, React.createElement("h3", null, "时间"), React.createElement(index_5.default, null)), React.createElement("li", null, React.createElement("h3", null, "树"), React.createElement(index_4.default, { className: "myCls" }, React.createElement(TreeNode, { title: "parent 1", key: "0-0" }, React.createElement(TreeNode, { title: "parent 1-0", key: "0-0-0", disabled: true }, React.createElement(TreeNode, { title: "leaf", key: "0-0-0-0", disableCheckbox: true }), React.createElement(TreeNode, { title: "leaf", key: "0-0-0-1" })), React.createElement(TreeNode, { title: "parent 1-1", key: "0-0-1" }, React.createElement(TreeNode, { title: React.createElement("span", { style: { color: '#08c' } }, "sss"), key: "0-0-1-0" })))))), React.createElement("h2", null, "验证插件"), React.createElement("div", null, React.createElement("h3", null, "字符串长度 大小=>10 =<20"), React.createElement(index_7.default, { required: true, min: 10, max: 20 })), React.createElement("div", null, React.createElement("h3", null, "字符串长度 最短10 最长12"), React.createElement(index_7.default, { required: true, minLength: 10, maxLength: 12 })), React.createElement("div", null, React.createElement("h3", null, "只能输入英文和数字和中文"), React.createElement(index_7.default, { noSymbol: true })), React.createElement("div", null, React.createElement("h3", null, "手机号码"), React.createElement(index_7.default, { telephone: true })), React.createElement("div", null, React.createElement("h3", null, "自定义规则"), React.createElement(index_7.default, { gan: true }), React.createElement("code", null, 'addRule({\n                        key: \'gan\',\n                        messages: () => \'\u5FC5\u987B = \u4F60\u597D\',\n                        rule: (value, parameter) => value === \'\u4F60\u597D\',\n                    })')));
        }
    }]);

    return Component;
}(React.PureComponent);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component;
function handleChange(value) {
    console.log('selected ' + value);
}
});