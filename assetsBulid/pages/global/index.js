"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define("pages/global/index.js", function (require, exports, module) {
    "use strict";

    var __assign = this && this.__assign || Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) {
                if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
        }
        return t;
    };
    var React = require('react');
    var ReactDOM = require('react-dom');
    var react_router_1 = require('react-router');
    var index_1 = require('../../components/nav/index');
    function async(text) {
        return function (location, callback) {
            console.log('加载：' + text);
            require.async(text, function (mod) {
                var Com = mod.default;
                callback(null, function (prop) {
                    return React.createElement(Main, __assign({}, prop), React.createElement(Com, null));
                });
            });
        };
    }

    var Main = function (_React$Component) {
        _inherits(Main, _React$Component);

        function Main() {
            _classCallCheck(this, Main);

            return _possibleConstructorReturn(this, (Main.__proto__ || Object.getPrototypeOf(Main)).apply(this, arguments));
        }

        _createClass(Main, [{
            key: "render",
            value: function render() {
                return React.createElement("div", { className: "h100" }, React.createElement(index_1.default, null), React.createElement("main", null, this.props.children));
            }
        }]);

        return Main;
    }(React.Component);

    var AppRouter = function (_React$Component2) {
        _inherits(AppRouter, _React$Component2);

        function AppRouter() {
            _classCallCheck(this, AppRouter);

            return _possibleConstructorReturn(this, (AppRouter.__proto__ || Object.getPrototypeOf(AppRouter)).apply(this, arguments));
        }

        _createClass(AppRouter, [{
            key: "render",
            value: function render() {
                return React.createElement(react_router_1.Router, { history: react_router_1.hashHistory }, React.createElement(react_router_1.Redirect, { from: "/", to: "/react" }), React.createElement(react_router_1.Route, { path: "/react", getComponents: async('../react/index') }), React.createElement(react_router_1.Route, { path: "/redux", getComponents: async('../redux/index') }), React.createElement(react_router_1.Route, { path: "/antd", getComponents: async('../antd/index') }), React.createElement(react_router_1.Route, { path: "*", getComponents: async('../error/index') }));
            }
        }]);

        return AppRouter;
    }(React.Component);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AppRouter;
    ReactDOM.render(React.createElement(AppRouter, null), document.getElementById('app'));
});
//# sourceMappingURL=index.js.map
