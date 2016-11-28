define("components/global/index.js",function(require, exports, module) {
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var __assign = undefined && undefined.__assign || Object.assign || function (t) {
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
var index_1 = require('../nav/index');

var Main = function (_React$Component) {
    _inherits(Main, _React$Component);

    function Main() {
        _classCallCheck(this, Main);

        var _this = _possibleConstructorReturn(this, (Main.__proto__ || Object.getPrototypeOf(Main)).apply(this, arguments));

        _this.state = {
            loading: 0,
            page: React.createElement("div", null)
        };
        _this.asyncRender = false;
        return _this;
    }

    _createClass(Main, [{
        key: 'asyncLoading',
        value: function asyncLoading() {
            var _this2 = this;

            this.asyncRender = false;
            var props = this.props;
            // 自动解析
            var url = props.route.path === '*' ? '../../pages' + props.location.pathname + '/index' : '../' + props.route.path;
            console.log('加载：' + url);
            this.state.loading = 0;
            this.setState(this.state);
            setTimeout(function () {
                _this2.state.loading = 1;
                _this2.setState(_this2.state);
            }, 0);
            require.async(url, function (mod) {
                _this2.state.loading = 2;
                if (mod) {
                    var Com = mod.default;
                    _this2.state.page = React.createElement(Com, null);
                    _this2.setState(_this2.state);
                } else {
                    require.async('../../pages/error/index.js', function (mod) {
                        var Com = mod.default;
                        _this2.state.page = React.createElement(Com, { status: 404 });
                        _this2.setState(_this2.state);
                    });
                }
            });
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var oldLocation = this.props.location;
            var location = nextProps.location;
            if (oldLocation.pathname != location.pathname || oldLocation.search != location.search) {
                this.asyncRender = true;
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            if (this.asyncRender) {
                this.asyncLoading();
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.asyncLoading();
        }
    }, {
        key: 'getLoadingClass',
        value: function getLoadingClass() {
            switch (this.state.loading) {
                case 0:
                    return '';
                case 1:
                    return 'loading-box-loading';
                case 2:
                    return 'loading-box-complete';
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement("div", { className: 'h100' }, React.createElement(index_1.default, null), React.createElement("div", { className: "loading-box " + this.getLoadingClass() }, React.createElement("div", { className: "loading-box-inner" })), React.createElement("main", null, this.state.page));
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
        key: 'async',
        value: function async(text) {
            return function (obj, callback) {
                callback(null, function (prop) {
                    return React.createElement(Main, __assign({}, prop));
                });
            };
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement("section", { className: 'h100' }, React.createElement(react_router_1.Router, { history: react_router_1.hashHistory }, React.createElement(react_router_1.Redirect, { from: '/', to: '/react' }), React.createElement(react_router_1.Route, { path: '*', component: Main })));
        }
    }]);

    return AppRouter;
}(React.Component);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AppRouter;
ReactDOM.render(React.createElement(AppRouter, null), document.getElementById('app'));
});
//# sourceMappingURL=index.js.map
