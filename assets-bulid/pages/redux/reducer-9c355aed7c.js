define("pages/redux/reducer.js",function(require, exports, module) {
"use strict";function _defineProperty(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}var redux_actions_1=require("redux-actions"),action=require("./action"),redux_1=require("redux"),initialState={list:["选项1"]};exports.reducer=redux_actions_1.handleActions(_defineProperty({},action.ADD_STR,function(e,r){return e=Object.assign({},e),e.list.push(r.payload),e}),initialState),exports.frootReducer=redux_1.combineReducers({state:exports.reducer}),Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=exports.frootReducer;
});
//# sourceMappingURL=reducer.js.map
