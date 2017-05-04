define("components/global/index-4bb5257f.js",["react","react-dom","react-router","../nav/index-52277b02.js"],function(require, exports, module) {
'use strict';

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
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator.throw(value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var React = require('react');
var ReactDOM = require('react-dom');
var react_router_1 = require('react-router');
var index_1 = require('../nav/index-52277b02.js');

var Main = function (_React$Component) {
    _inherits(Main, _React$Component);

    function Main() {
        var _ref;

        _classCallCheck(this, Main);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = Main.__proto__ || Object.getPrototypeOf(Main)).call.apply(_ref, [this].concat(args)));

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
            return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
                var _this2 = this;

                var props, url, md5obj, mod, Com, _Com;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                this.asyncRender = false;
                                props = this.props;
                                // 自动解析

                                url = props.route.path === '*' ? 'pages' + props.location.pathname + '/index.js' : 'pages/' + props.route.path + '/index.js';

                                if (window.__md5Array) {
                                    md5obj = __md5Array.find(function (value) {
                                        return value.path === url;
                                    });

                                    if (md5obj) {
                                        url = md5obj.md5;
                                    }
                                }
                                console.log('加载：' + url);
                                this.state.loading = 0;
                                this.setState(this.state);
                                setTimeout(function () {
                                    _this2.state.loading = 1;
                                    _this2.setState(_this2.state);
                                }, 0);
                                this.state.loading = 2;
                                _context.next = 11;
                                return require.ensure(url);

                            case 11:
                                mod = _context.sent;

                                if (!mod) {
                                    _context.next = 18;
                                    break;
                                }

                                Com = mod.default;

                                this.state.page = React.createElement(Com, null);
                                this.setState(this.state);
                                _context.next = 24;
                                break;

                            case 18:
                                _context.next = 20;
                                return require.ensure('../../pages/error/index.js');

                            case 20:
                                mod = _context.sent;
                                _Com = mod.default;

                                this.state.page = React.createElement(_Com, { status: 404 });
                                this.setState(this.state);

                            case 24:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
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
            window['__reload'] = function (msg) {
                // console.log(msg);
                axibaModular.load(msg, true);
                axibaModular.run('components/global/index.js');
                // this.setState(this.state);
            };
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