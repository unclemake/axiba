define("pages/react/index-ddf458df.js",function(require, exports, module) {
"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),React=require("react"),Component=function(e){function t(){_classCallCheck(this,t);var e=_possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments));return e.state={btnNu:1,btnText:"点击我",component2:1},e}return _inherits(t,e),_createClass(t,[{key:"btnClick",value:function(){this.setState({btnNu:this.state.btnNu+1})}},{key:"changeProps",value:function(){this.setState({component2:this.state.component2+1})}},{key:"render",value:function(){var e=this,t=this.state;return React.createElement("section",{className:"page-home"},React.createElement("p",null,"点击事件的2种绑定方式"),React.createElement("div",null,React.createElement("a",{onClick:this.btnClick.bind(this)},t.btnText,":",t.btnNu),"  ",React.createElement("a",{onClick:function(){return e.changeProps()}},"修改Component2属性")),React.createElement("br",null),React.createElement("br",null),React.createElement("br",null),React.createElement("br",null),React.createElement(Component2,{nu:this.state.component2,type:"text"}))}}]),t}(React.PureComponent);Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=Component;var Component2=function(e){function t(){_classCallCheck(this,t);var e=_possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments));return e.state={btnNu:e.props.nu},e}return _inherits(t,e),_createClass(t,[{key:"btnClick",value:function(){this.setState({btnNu:this.state.btnNu+1})}},{key:"componentWillMount",value:function(){console.log("componentWillMount")}},{key:"componentDidMount",value:function(){console.log("componentDidMount")}},{key:"componentWillReceiveProps",value:function(){console.log("componentWillReceiveProps")}},{key:"ReactCompositeComponent",value:function(){return console.log("ReactCompositeComponent"),!0}},{key:"componentWillUnmount",value:function(){console.log("componentWillUnmount")}},{key:"render",value:function(){var e=this.state;return React.createElement("section",{className:"page=home"},React.createElement("p",null,"组件的创建和调用  react 生命周期"),React.createElement("div",null,React.createElement("input",{type:"text"}),React.createElement("a",{onClick:this.btnClick.bind(this),className:"ant-btn"},React.createElement("i",{className:"iconfont icon-home white"}),"点击:",e.btnNu)),React.createElement("p",null,"props['nu]: ",this.props.nu))}}]),t}(React.PureComponent);exports.Component2=Component2;
});