define("pages/react/index.js",function(require, exports, module) {
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
/**
 * react页面默认default 加载组件
 * @class Component
 * @extends {React.Component<any, any>}
 */

var Component = function (_React$PureComponent) {
    _inherits(Component, _React$PureComponent);

    function Component() {
        _classCallCheck(this, Component);

        /**
         * 状态
         * @memberOf Component
         */
        var _this = _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).apply(this, arguments));

        _this.state = {
            btnNu: 1,
            btnText: '点击我',
            component2: 1
        };
        return _this;
    }
    /**
     * 点击事件 函数
     * @memberOf Component
     */


    _createClass(Component, [{
        key: 'btnClick',
        value: function btnClick() {
            this.setState({
                btnNu: this.state.btnNu + 1
            });
        }
        /**
         * 改变 component2的props
         *
         *
         * @memberOf Component
         */

    }, {
        key: 'changeProps',
        value: function changeProps() {
            this.setState({
                component2: this.state.component2 + 1
            });
        }
        /**
         * 渲染函数
         * @returns jsx
         * @memberOf Component
         */

    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var state = this.state;

            return React.createElement("section", { className: 'page-home' }, React.createElement("p", null, "点击事件的2种绑定方式"), React.createElement("div", null, React.createElement("a", { onClick: this.btnClick.bind(this) }, state.btnText, ":", state.btnNu), "  ", React.createElement("a", { onClick: function onClick() {
                    return _this2.changeProps();
                } }, "修改Component2属性")), React.createElement("br", null), React.createElement("br", null), React.createElement("br", null), React.createElement("br", null), React.createElement(Component2, { nu: this.state.component2, type: 'text' }));
        }
    }]);

    return Component;
}(React.PureComponent);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component;
/**
 * Component2 组件
 *
 * @class Component2
 * @extends {React.Component<{
 *     nu: number
 * }, any>}
 */

var Component2 = function (_React$PureComponent2) {
    _inherits(Component2, _React$PureComponent2);

    function Component2() {
        _classCallCheck(this, Component2);

        /**
         * 初始化状态
         * @memberOf Component2
         */
        var _this3 = _possibleConstructorReturn(this, (Component2.__proto__ || Object.getPrototypeOf(Component2)).apply(this, arguments));

        _this3.state = {
            btnNu: _this3.props.nu
        };
        return _this3;
    }
    /**
     * 点击函数
     * @memberOf Component2
     */


    _createClass(Component2, [{
        key: 'btnClick',
        value: function btnClick() {
            this.setState({
                btnNu: this.state.btnNu + 1
            });
        }
        /**
         * 接收到新的props或者state后，进行渲染之前调用，此时不允许更新props或state。
         *
         *
         * @memberOf Component2
         */

    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            console.log('componentWillMount');
        }
        /**
         * 完成渲染新的props或者state后调用，此时可以访问到新的DOM元素。
         *
         *
         * @memberOf Component2
         */

    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            console.log('componentDidMount');
        }
        /**
         * 组件接收到新的props时调用，并将其作为参数nextProps使用，此时可以更改组件props及state。
         *
         *
         * @memberOf Component2
         */

    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps() {
            console.log('componentWillReceiveProps');
        }
        /**
         * 组件是否应当渲染新的props或state，返回false表示跳过后续的生命周期方法，通常不需要使用以避免出现bug。在出现应用的瓶颈时，可通过该方法进行适当的优化。
         *
         * @returns
         *
         * @memberOf Component2
         */

    }, {
        key: 'ReactCompositeComponent',
        value: function ReactCompositeComponent() {
            console.log('ReactCompositeComponent');
            return true;
        }
        /**
         * 销毁&清理期
         *
         *
         * @memberOf Component2
         */

    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            console.log('componentWillUnmount');
        }
        /**
         * 渲染
         * @returns jsx
         * @memberOf Component2
         */

    }, {
        key: 'render',
        value: function render() {
            var state = this.state;

            return React.createElement("section", { className: 'page=home' }, React.createElement("p", null, "组件的创建和调用  react 生命周期"), React.createElement("div", null, React.createElement("input", { type: 'text' }), React.createElement("a", { onClick: this.btnClick.bind(this), className: 'ant-btn' }, React.createElement("i", { className: 'iconfont icon-home white' }), "点击:", state.btnNu)), React.createElement("p", null, "props['nu]: ", this.props.nu));
        }
    }]);

    return Component2;
}(React.PureComponent);

exports.Component2 = Component2;
});
//# sourceMappingURL=index.js.map
