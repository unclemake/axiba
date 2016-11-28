define("components/button/index-b6d6eb42.js",function(require, exports, module) {
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
require('../antd/button/style/index-0c84a35e.css');
var index_1 = require('../spin/index-0a299a0c.js');
var Button = require('antd/lib/button/index');
exports.Button = Button;
var SpinC = index_1.default;

var Component = function (_React$Component) {
    _inherits(Component, _React$Component);

    function Component() {
        _classCallCheck(this, Component);

        var _this = _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).apply(this, arguments));

        _this.state = {
            loading: false
        };
        return _this;
    }

    _createClass(Component, [{
        key: 'onClick',
        value: function onClick(e) {
            var onClickBack = this.props.onClick(e);
            var self = this;
            if (onClickBack && onClickBack.then) {
                self.state.loading = true;
                self.setState(self.state);
                return onClickBack.then(function (arg) {
                    self.state.loading = false;
                    self.setState(self.state);
                    return arg;
                }, function (arg) {
                    self.state.loading = false;
                    self.setState(self.state);
                    return arg;
                });
            } else {
                return onClickBack;
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(SpinC, { spinning: this.state.loading, size: "small", style: { display: 'inline-block' } }, React.createElement(Button, { onClick: this.props.onClick ? this.onClick.bind(this) : function () {} }, this.props.children));
        }
    }]);

    return Component;
}(React.Component);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component;
});
//# sourceMappingURL=index.js.map
