define("components/button/index.js",function(require, exports, module) {
"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var _createClass=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),React=require("react");require("../antd/button/style/index.css");var index_1=require("../spin/index"),Button=require("antd/lib/button/index");exports.Button=Button;var SpinC=index_1.default,Component=function(t){function e(){_classCallCheck(this,e);var t=_possibleConstructorReturn(this,(e.__proto__||Object.getPrototypeOf(e)).apply(this,arguments));return t.state={loading:!1},t}return _inherits(e,t),_createClass(e,[{key:"onClick",value:function(t){var e=this.props.onClick(t),n=this;return e&&e.then?(n.state.loading=!0,n.setState(n.state),e.then(function(t){return n.state.loading=!1,n.setState(n.state),t},function(t){return n.state.loading=!1,n.setState(n.state),t})):e}},{key:"render",value:function(){return React.createElement(SpinC,{spinning:this.state.loading,size:"small",style:{display:"inline-block"}},React.createElement(Button,{onClick:this.props.onClick?this.onClick.bind(this):function(){}},this.props.children))}}]),e}(React.Component);Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=Component;
});
//# sourceMappingURL=index.js.map
