define("components/global/index-de32d447.js",function(require, exports, module) {
"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),__assign=Object.assign||function(e){for(var t,n=1,a=arguments.length;n<a;n++){t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e},React=require("react"),ReactDOM=require("react-dom"),react_router_1=require("react-router"),index_1=require("../nav/index-5c3852ca.js"),Main=function(e){function t(){_classCallCheck(this,t);var e=_possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments));return e.state={loading:0,page:React.createElement("div",null)},e.asyncRender=!1,e}return _inherits(t,e),_createClass(t,[{key:"asyncLoading",value:function(){var e=this;this.asyncRender=!1;var t=this.props,n="*"===t.route.path?"pages"+t.location.pathname+"/index.js":"pages/"+t.route.path+"/index.js";if(window.__md5Array){var a=__md5Array.find(function(e){return e.path===n});a&&(n=a.md5)}console.log("加载："+n),this.state.loading=0,this.setState(this.state),setTimeout(function(){e.state.loading=1,e.setState(e.state)},0),require.async(n,function(t){if(e.state.loading=2,t){var n=t.default;e.state.page=React.createElement(n,null),e.setState(e.state)}else require.async("../../pages/error/index.js",function(t){var n=t.default;e.state.page=React.createElement(n,{status:404}),e.setState(e.state)})})}},{key:"componentWillReceiveProps",value:function(e){var t=this.props.location,n=e.location;t.pathname==n.pathname&&t.search==n.search||(this.asyncRender=!0)}},{key:"componentDidUpdate",value:function(){this.asyncRender&&this.asyncLoading()}},{key:"componentDidMount",value:function(){this.asyncLoading()}},{key:"getLoadingClass",value:function(){switch(this.state.loading){case 0:return"";case 1:return"loading-box-loading";case 2:return"loading-box-complete"}}},{key:"render",value:function(){return React.createElement("div",{className:"h100"},React.createElement(index_1.default,null),React.createElement("div",{className:"loading-box "+this.getLoadingClass()},React.createElement("div",{className:"loading-box-inner"})),React.createElement("main",null,this.state.page))}}]),t}(React.Component),AppRouter=function(e){function t(){return _classCallCheck(this,t),_possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return _inherits(t,e),_createClass(t,[{key:"async",value:function(e){return function(e,t){t(null,function(e){return React.createElement(Main,__assign({},e))})}}},{key:"render",value:function(){return React.createElement("section",{className:"h100"},React.createElement(react_router_1.Router,{history:react_router_1.hashHistory},React.createElement(react_router_1.Redirect,{from:"/",to:"/react"}),React.createElement(react_router_1.Route,{path:"dang",component:Main}),React.createElement(react_router_1.Route,{path:"*",component:Main})))}}]),t}(React.Component);Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=AppRouter,ReactDOM.render(React.createElement(AppRouter,null),document.getElementById("app"));
});