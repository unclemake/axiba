define("pages/redux/component.js",function(require, exports, module) {
"use strict";
/**
* 预约中心
*/

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var index_1 = require('../../components/button/index');
var index_2 = require('../../components/input/index');
var react_redux_1 = require('react-redux');
var action = require('./action');
require('./index.css');

var App = function (_React$PureComponent) {
    _inherits(App, _React$PureComponent);

    function App() {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));

        _this.state = {
            str: ''
        };
        return _this;
    }

    _createClass(App, [{
        key: 'change',
        value: function change(e) {
            this.state.str = e.target.value;
            this.setState(this.state);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                state = _props.state,
                dispatch = _props.dispatch;

            return React.createElement("section", { className: 'page-redux' }, React.createElement("h2", null, "redux"), React.createElement(index_2.default, { placeholder: '填写', value: this.state.str, onChange: this.change.bind(this) }), React.createElement(index_1.default, { onClick: function onClick() {
                    return dispatch(action.addStr(_this2.state.str));
                } }, "添加"), React.createElement("h3", null, "列表"), React.createElement("ul", null, state.list.map(function (value, index) {
                return React.createElement("li", { key: index }, value);
            })), React.createElement("h3", null, "样式"), React.createElement("p", { className: 'css1' }, "样式"));
        }
    }]);

    return App;
}(React.PureComponent);
// 导出


var mapStateToProps = function mapStateToProps(state) {
    return state;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps)(App);
});
//# sourceMappingURL=component.js.map
