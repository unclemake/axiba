define("pages/redux/index-fbd296f0.js",function(require, exports, module) {
"use strict";function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,r){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!r||"object"!=typeof r&&"function"!=typeof r?e:r}function _inherits(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function, not "+typeof r);e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),r&&(Object.setPrototypeOf?Object.setPrototypeOf(e,r):e.__proto__=r)}var _createClass=function(){function e(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(r,t,n){return t&&e(r.prototype,t),n&&e(r,n),r}}(),React=require("react"),react_redux_1=require("react-redux"),redux_1=require("redux"),redux_thunk_1=require("redux-thunk"),reducer_1=require("./reducer-d2cfc370.js"),component_1=require("./component-c527baac.js"),store=redux_1.createStore(reducer_1.frootReducer,redux_1.applyMiddleware(redux_thunk_1.default)),App=function(e){function r(){return _classCallCheck(this,r),_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).apply(this,arguments))}return _inherits(r,e),_createClass(r,[{key:"render",value:function(){return React.createElement(react_redux_1.Provider,{store:store},React.createElement(component_1.default,null))}}]),r}(React.PureComponent);Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=App;
});