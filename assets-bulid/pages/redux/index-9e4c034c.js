define("pages/redux/index-9e4c034c.js",function(require, exports, module) {
"use strict";
/**
* 预约中心
*/

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var react_redux_1 = require('react-redux');
var redux_1 = require('redux');
var redux_thunk_1 = require('redux-thunk');
var reducer_1 = require('./reducer-5d111a59.js');
var component_1 = require('./component-3bff5ead.js');
//创建store
var store = redux_1.createStore(reducer_1.frootReducer, redux_1.applyMiddleware(redux_thunk_1.default));
//渲染

var App = function (_React$PureComponent) {
    _inherits(App, _React$PureComponent);

    function App() {
        _classCallCheck(this, App);

        return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
    }

    _createClass(App, [{
        key: 'render',
        value: function render() {
            return React.createElement(react_redux_1.Provider, { store: store }, React.createElement(component_1.default, null));
        }
    }]);

    return App;
}(React.PureComponent);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
});
//# sourceMappingURL=index.js.map
