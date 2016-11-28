define("pages/redux/action.js",function(require, exports, module) {
"use strict";

var redux_actions_1 = require('redux-actions');
/**
 * 添加字符串
 */
exports.ADD_STR = 'ADD_STR';
exports.addStr = redux_actions_1.createAction(exports.ADD_STR, function (args) {
  return args;
});
});
//# sourceMappingURL=action.js.map
