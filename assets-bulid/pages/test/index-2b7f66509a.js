define("pages/test/index-2b7f66509a.js",function(require, exports, module) {
"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),React=require("react"),Component=function(e){function t(){_classCallCheck(this,t);var e=_possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments));return e.state={text:"点击我",text2:"text2"},e}return _inherits(t,e),_createClass(t,[{key:"btnClick",value:function(){this.setState({text:"1",text2:"text2"})}},{key:"render",value:function(){var e=this.state;return React.createElement("section",{className:"page-home"},React.createElement("h2",null,"代码调试页面"),React.createElement("div",null,React.createElement("a",{onClick:this.btnClick.bind(this),className:"ant-btn"},"点我")),React.createElement("div",null,this.state.text),React.createElement(Component2,{text2:e.text2}))}}]),t}(React.PureComponent);Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=Component;var Component2=function(e){function t(){return _classCallCheck(this,t),_possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return _inherits(t,e),_createClass(t,[{key:"render",value:function(){return React.createElement("section",{className:"page=home"},React.createElement("h2",null,"简单例子2"),React.createElement("div",null,this.props.text2))}}]),t}(React.PureComponent);
});
//# sourceMappingURL=index-2b7f66509a.js.map
