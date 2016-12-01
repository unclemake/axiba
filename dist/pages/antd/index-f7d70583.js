define("pages/antd/index-f7d70583.js",function(require, exports, module) {
"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function handleChange(e){console.log("selected "+e)}var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var l=t[n];l.enumerable=l.enumerable||!1,l.configurable=!0,"value"in l&&(l.writable=!0),Object.defineProperty(e,l.key,l)}}return function(t,n,l){return n&&e(t.prototype,n),l&&e(t,l),t}}(),React=require("react"),index_1=require("../../components/button/index-72d1ab9e.js"),index_2=require("../../components/select/index-1d9a1094.js"),index_3=require("../../components/input/index-9f4d916c.js"),index_4=require("../../components/tree/index-814a89bc.js"),index_5=require("../../components/date-picker/index-c004f2c9.js"),index_6=require("../../components/notification/index-c2646eca.js"),index_7=require("../../components/validate/index-288d90bf.js"),TreeNode=index_4.default.TreeNode;index_7.addRule({key:"gan",messages:function(){return"必须 = 你好"},rule:function(e,t){return"你好"===e}});var Option=index_2.default.Option,Component=function(e){function t(){return _classCallCheck(this,t),_possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return _inherits(t,e),_createClass(t,[{key:"render",value:function(){return React.createElement("section",{className:"page=home"},React.createElement("h2",null,"插件"),React.createElement("ul",null,React.createElement("li",null,React.createElement("h3",null,"按钮"),React.createElement(index_1.default,null,"Hello world!")),React.createElement("li",null,React.createElement("h3",null,"下拉框"),React.createElement(index_2.default,{size:"large",defaultValue:"lucy",style:{width:200},onChange:handleChange},React.createElement(Option,{value:"jack"},"Jack"),React.createElement(Option,{value:"lucy"},"Lucy"),React.createElement(Option,{value:"disabled",disabled:!0},"Disabled"),React.createElement(Option,{value:"yiminghe"},"Yiminghe"))),React.createElement("li",null,React.createElement("h3",null,"输入框"),React.createElement(index_3.default,null)),React.createElement("li",null,React.createElement("h3",null,"弹窗"),React.createElement(index_1.default,{onClick:function(){return index_6.success({message:"你好",description:"success"})}},"success"),React.createElement(index_1.default,{onClick:function(){return index_6.error({message:"你好",description:"error"})}},"error")),React.createElement("li",null,React.createElement("h3",null,"时间"),React.createElement(index_5.default,null)),React.createElement("li",null,React.createElement("h3",null,"树"),React.createElement(index_4.default,{className:"myCls"},React.createElement(TreeNode,{title:"parent 1",key:"0-0"},React.createElement(TreeNode,{title:"parent 1-0",key:"0-0-0",disabled:!0},React.createElement(TreeNode,{title:"leaf",key:"0-0-0-0",disableCheckbox:!0}),React.createElement(TreeNode,{title:"leaf",key:"0-0-0-1"})),React.createElement(TreeNode,{title:"parent 1-1",key:"0-0-1"},React.createElement(TreeNode,{title:React.createElement("span",{style:{color:"#08c"}},"sss"),key:"0-0-1-0"})))))),React.createElement("h2",null,"验证插件"),React.createElement("div",null,React.createElement("h3",null,"字符串长度 大小=>10 =<20"),React.createElement(index_7.default,{required:!0,min:10,max:20})),React.createElement("div",null,React.createElement("h3",null,"字符串长度 最短10 最长12"),React.createElement(index_7.default,{required:!0,minLength:10,maxLength:12})),React.createElement("div",null,React.createElement("h3",null,"只能输入英文和数字和中文"),React.createElement(index_7.default,{noSymbol:!0})),React.createElement("div",null,React.createElement("h3",null,"手机号码"),React.createElement(index_7.default,{telephone:!0})),React.createElement("div",null,React.createElement("h3",null,"自定义规则"),React.createElement(index_7.default,{gan:!0}),React.createElement("code",null,"addRule({\n                        key: 'gan',\n                        messages: () => '必须 = 你好',\n                        rule: (value, parameter) => value === '你好',\n                    })")))}}]),t}(React.PureComponent);Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=Component;
});