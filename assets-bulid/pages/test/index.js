define("pages/test/index.js",function(require, exports, module) {
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');

var Component = function (_React$PureComponent) {
    _inherits(Component, _React$PureComponent);

    function Component() {
        _classCallCheck(this, Component);

        var _this = _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).apply(this, arguments));

        _this.state = {
            text: '点击我',
            text2: 'text2'
        };
        return _this;
    }

    _createClass(Component, [{
        key: 'btnClick',
        value: function btnClick() {
            this.setState({
                text: '1',
                text2: 'text2'
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var state = this.state;

            return React.createElement("section", { className: 'page-home' }, React.createElement("h2", null, "代码调试页面"), React.createElement("div", null, React.createElement("a", { onClick: this.btnClick.bind(this), className: 'ant-btn' }, "点我")), React.createElement("div", null, this.state.text), React.createElement(Component2, { text2: state.text2 }));
        }
    }]);

    return Component;
}(React.PureComponent);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component;

var Component2 = function (_React$PureComponent2) {
    _inherits(Component2, _React$PureComponent2);

    function Component2() {
        _classCallCheck(this, Component2);

        return _possibleConstructorReturn(this, (Component2.__proto__ || Object.getPrototypeOf(Component2)).apply(this, arguments));
    }

    _createClass(Component2, [{
        key: 'render',
        value: function render() {
            return React.createElement("section", { className: 'page=home' }, React.createElement("h2", null, "简单例子2"), React.createElement("div", null, this.props.text2));
        }
    }]);

    return Component2;
}(React.PureComponent);
});
//# sourceMappingURL=index.js.map
