define("pages/ajax/index-9681e446.js",["react","../../components/ajax/index-da517994.js","../../components/button/index-0b1599fb.js"],function(require, exports, module) {
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
var index_1 = require('../../components/ajax/index-da517994.js');
var index_2 = require('../../components/button/index-0b1599fb.js');
/**
 * ajax demo
 *
 * @export
 * @class Component
 * @extends {React.Component<any, any>}
 */

var Component = function (_React$PureComponent) {
    _inherits(Component, _React$PureComponent);

    function Component() {
        var _ref;

        _classCallCheck(this, Component);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        /**
         * 状态保存log
         *
         *
         * @memberOf Component
         */
        var _this = _possibleConstructorReturn(this, (_ref = Component.__proto__ || Object.getPrototypeOf(Component)).call.apply(_ref, [this].concat(args)));

        _this.state = {
            text: []
        };
        return _this;
    }
    /**
     * log输出
     *
     * @param {any} msg
     *
     * @memberOf Component
     */


    _createClass(Component, [{
        key: 'log',
        value: function log(msg) {
            this.state.text.push(msg);
            this.setState(this.state);
        }
        /**
         * 第一个按钮
         *
         *
         * @memberOf Component
         */

    }, {
        key: 'getAjax',
        value: function getAjax() {
            return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
                var _this2 = this;

                var res;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                this.log('默认400毫秒只能调用一次');
                                this.log('调用第一次');
                                /**
                                 *
                                 *
                                 * @param {any} res
                                 */
                                res = index_1.get('assets/components/nav/index.tsx').then(function (res) {
                                    _this2.log('调用第一次成功');
                                    _this2.log('-------');
                                });

                                this.log('调用第二次');
                                index_1.get('assets/components/nav/index.tsx').then(function (res) {
                                    _this2.setState(_this2.state);
                                    _this2.log('调用第二次成功');
                                });

                            case 5:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
        }
        /**
         * 第二个按钮
         * 当按钮点击事件 返回的是 Promise 会有个loading
         * @returns
         *
         * @memberOf Component
         */

    }, {
        key: 'getAjax1',
        value: function getAjax1() {
            return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee2() {
                var _this3 = this;

                var res;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                this.log('缓存');
                                this.log('调用第一次');
                                _context2.next = 4;
                                return index_1.get('assets/components/nav/index.tsx', null, 1);

                            case 4:
                                res = _context2.sent;

                                this.log('调用第一次成功');
                                this.log('调用第二次');
                                return _context2.abrupt('return', index_1.get('assets/components/nav/index.tsx', null, 1).then(function (res) {
                                    _this3.log('调用第二次成功');
                                    _this3.log('-------');
                                }));

                            case 8:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));
        }
        /**
         * 第三个按钮
         * 当按钮点击事件 返回的是 Promise 会有个loading
         * @returns
         *
         * @memberOf Component
         */

    }, {
        key: 'getAjax2',
        value: function getAjax2() {
            return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee3() {
                var _this4 = this;

                var res;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                this.log('延迟提交 400ms 只提交最后一次ajax');
                                this.log('调用第一次');
                                /**
                                 *
                                 *
                                 * @param {any} res
                                 */
                                res = index_1.get('assets/components/nav/index.tsx', null, 2).then(function (res) {
                                    _this4.log('调用第一次成功');
                                });

                                this.log('调用第二次');
                                return _context3.abrupt('return', index_1.get('assets/components/nav/index.tsx', null, 2).then(function (res) {
                                    _this4.log('调用第二次成功');
                                    _this4.log('-------');
                                }));

                            case 5:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));
        }
        /**
         * 渲染
         *
         * @returns
         *
         * @memberOf Component
         */

    }, {
        key: 'render',
        value: function render() {
            return React.createElement("section", { className: 'page-home' }, React.createElement("h2", null, "简单例子55"), React.createElement("div", null, React.createElement(index_2.default, { onClick: this.getAjax.bind(this) }, "get1"), React.createElement(index_2.default, { onClick: this.getAjax1.bind(this) }, "get2"), React.createElement(index_2.default, { onClick: this.getAjax2.bind(this) }, "get3")), this.state.text.map(function (value, index) {
                return React.createElement("p", { key: index }, value);
            }));
        }
    }]);

    return Component;
}(React.PureComponent);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component;
});