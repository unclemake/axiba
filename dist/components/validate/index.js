define("components/validate/index.js",["react","../input/index","./rule","../popover/index"],function(require, exports, module) {
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var index_1 = require('../input/index');
var rule_1 = require('./rule');
exports.addRule = rule_1.addRule;
exports.getLength = rule_1.getLength;
var index_2 = require('../popover/index');
;
;
/**
 * 验证类
 *
 * @class Validate
 * @extends {React.Component<IValidateProps, IValidateState>}
 */

var Validate = function (_React$Component) {
    _inherits(Validate, _React$Component);

    function Validate() {
        var _ref;

        _classCallCheck(this, Validate);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        /**
         * 状态
         *
         * @memberOf Validate
         */
        var _this = _possibleConstructorReturn(this, (_ref = Validate.__proto__ || Object.getPrototypeOf(Validate)).call.apply(_ref, [this].concat(args)));

        _this.state = {
            msg: [],
            validate: true,
            value: _this.props.value
        };
        return _this;
    }
    /**
     * 验证事件
     *
     * @private
     * @param {any} e
     * @returns
     *
     * @memberOf Validate
     */


    _createClass(Validate, [{
        key: 'validate',
        value: function validate(e) {
            var value = e.target.value;
            var state = this.state;
            state.msg = [];
            state.validate = true;
            //去除前后空格
            state.value = rule_1.replaceDefault(value);
            if (this.props.required) {
                var validate = this.valueValidateSave('required', value);
                this.setState(this.state);
                this.hiddenPopover();
                if (!validate) {
                    return;
                }
            } else {
                var _validate = this.valueValidate('required', value);
                if (!_validate) {
                    return;
                }
            }
            for (var key in this.props) {
                if (rule_1.messages.hasOwnProperty(key)) {
                    state.value = this.valueReplace(key, value);
                    var _validate2 = this.valueValidateSave(key, value);
                }
            }
            this.setState(this.state);
            this.hiddenPopover();
        }
        /**
         * 定时隐藏提示框
         *
         * @private
         *
         * @memberOf Validate
         */

    }, {
        key: 'hiddenPopover',
        value: function hiddenPopover() {
            var _this2 = this;

            clearTimeout(this.hiddenST);
            this.hiddenST = setTimeout(function () {
                _this2.state.validate = true;
                _this2.setState(_this2.state);
            }, 4500);
        }
        /**
         * 输入值 替换
         *
         * @private
         * @param {any} key
         * @param {any} value
         * @returns
         *
         * @memberOf Validate
         */

    }, {
        key: 'valueReplace',
        value: function valueReplace(key, value) {
            var replaceFunction = rule_1.replaceArray[key];
            if (replaceFunction) {
                return replaceFunction(value);
            } else {
                return value;
            }
        }
        /**
         * 验证信息渲染
         *
         * @returns
         *
         * @memberOf Validate
         */

    }, {
        key: 'msgRender',
        value: function msgRender() {
            return React.createElement("div", null, this.state.msg.map(function (value, index) {
                return React.createElement("p", { key: index }, value);
            }));
        }
        /**
         * 验证
         *
         * @param {string} type 验证类型
         * @param {string} value 验证值
         * @returns
         *
         * @memberOf Validate
         */

    }, {
        key: 'valueValidate',
        value: function valueValidate(type, value) {
            var state = this.state,
                parameter = this.props[type],
                rule = rule_1.ruleArray[type] || rule_1.ruleDefault(type),
                validate = rule(value, parameter);
            return validate;
        }
        /**
         * 验证 --> 保存验证
         *
         * @param {string} type
         * @param {string} value
         * @returns
         *
         * @memberOf Validate
         */

    }, {
        key: 'valueValidateSave',
        value: function valueValidateSave(type, value) {
            var state = this.state,
                msg = rule_1.messages[type],
                parameter = this.props[type],
                validate = this.valueValidate(type, value);
            state.validate = state.validate && validate;
            validate || state.msg.push(msg(value, parameter));
            return validate;
        }
    }, {
        key: 'onChange',
        value: function onChange(e) {
            this.state.value = e.target.value;
            this.setState(this.state);
        }
        /**
         * 渲染
         *
         * @returns {JSX.Element}
         *
         * @memberOf Validate
         */

    }, {
        key: 'render',
        value: function render() {
            var props = this.props;

            return React.createElement(index_2.default, { overlayClassName: 'ant-popover-warning', placement: "topLeft", content: this.msgRender(), visible: !this.state.validate }, React.createElement(index_1.default, { value: this.state.value, onChange: this.onChange.bind(this), onBlur: this.validate.bind(this) }));
        }
    }]);

    return Validate;
}(React.Component);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Validate;
});