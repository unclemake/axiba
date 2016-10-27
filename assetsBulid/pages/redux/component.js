"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define("pages/redux/component.js", function (require, exports, module) {
    "use strict";
    /**
    * 预约中心
    */

    var React = require('react');
    var antd_1 = require('antd');
    var react_redux_1 = require('react-redux');
    var action = require('./action');
    require('./index.css');

    var App = function (_React$Component) {
        _inherits(App, _React$Component);

        function App() {
            var _ref;

            _classCallCheck(this, App);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var _this = _possibleConstructorReturn(this, (_ref = App.__proto__ || Object.getPrototypeOf(App)).call.apply(_ref, [this].concat(args)));

            _this.state = {
                str: ''
            };
            return _this;
        }

        _createClass(App, [{
            key: "change",
            value: function change(e) {
                this.state.str = e.target.value;
                this.setState(this.state);
            }
        }, {
            key: "render",
            value: function render() {
                var _this2 = this;

                var _props = this.props,
                    state = _props.state,
                    dispatch = _props.dispatch;

                return React.createElement("section", { className: "page-redux" }, React.createElement("h2", null, "redux"), React.createElement(antd_1.Input, { placeholder: "Basic usage", value: this.state.str, onChange: this.change.bind(this) }), React.createElement(antd_1.Button, { onClick: function onClick() {
                        return dispatch(action.addStr(_this2.state.str));
                    } }, "添加"), React.createElement("ul", null, state.list.map(function (value) {
                    return React.createElement("li", null, value);
                })), React.createElement("h2", null, "样式"), React.createElement("p", { className: "css1" }, "样式"));
            }
        }]);

        return App;
    }(React.Component);
    //导出


    var mapStateToProps = function mapStateToProps(state) {
        return state;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = react_redux_1.connect(mapStateToProps)(App);
});
//# sourceMappingURL=component.js.map
