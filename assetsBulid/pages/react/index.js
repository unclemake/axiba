"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define("pages/react/index.js", function (require, exports, module) {
    "use strict";

    var React = require('react');

    var Component = function (_React$Component) {
        _inherits(Component, _React$Component);

        function Component() {
            var _ref;

            _classCallCheck(this, Component);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var _this = _possibleConstructorReturn(this, (_ref = Component.__proto__ || Object.getPrototypeOf(Component)).call.apply(_ref, [this].concat(args)));

            _this.state = {
                btnText: '点击我',
                btnNu: 1
            };
            return _this;
        }

        _createClass(Component, [{
            key: "btnClick",
            value: function btnClick() {
                this.setState({
                    btnNu: this.state.btnNu + 1
                });
            }
        }, {
            key: "render",
            value: function render() {
                var _this2 = this;

                var state = this.state;

                return React.createElement("section", { className: "page=home" }, React.createElement("h2", null, "简单例子1"), React.createElement("div", null, React.createElement("a", { onClick: this.btnClick.bind(this), className: "ant-btn" }, state.btnText, ":", state.btnNu), React.createElement("a", { onClick: function onClick() {
                        return _this2.btnClick();
                    }, className: "ant-btn" }, state.btnText, ":", state.btnNu)), React.createElement(Component2, { nu: 10 }));
            }
        }]);

        return Component;
    }(React.Component);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Component;

    var Component2 = function (_React$Component2) {
        _inherits(Component2, _React$Component2);

        function Component2() {
            var _ref2;

            _classCallCheck(this, Component2);

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            var _this3 = _possibleConstructorReturn(this, (_ref2 = Component2.__proto__ || Object.getPrototypeOf(Component2)).call.apply(_ref2, [this].concat(args)));

            _this3.state = {
                btnNu: _this3.props.nu
            };
            return _this3;
        }

        _createClass(Component2, [{
            key: "btnClick",
            value: function btnClick() {
                this.setState({
                    btnNu: this.state.btnNu + 1
                });
            }
        }, {
            key: "render",
            value: function render() {
                var state = this.state;

                return React.createElement("section", { className: "page=home" }, React.createElement("h2", null, "简单例子2"), React.createElement("div", null, React.createElement("a", { onClick: this.btnClick.bind(this), className: "ant-btn" }, React.createElement("i", { className: "iconfont icon-home white" }), "点击:", state.btnNu)));
            }
        }]);

        return Component2;
    }(React.Component);
});
//# sourceMappingURL=index.js.map
