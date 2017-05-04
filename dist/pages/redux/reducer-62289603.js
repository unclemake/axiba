define("pages/redux/reducer-62289603.js",["redux-actions","./action-1e1fe934.js","redux"],function(require, exports, module) {
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * reducer
 */
var redux_actions_1 = require('redux-actions');
var action = require('./action-1e1fe934.js');
var redux_1 = require('redux');
/**
 * 默认数据
 */
var initialState = {
  list: ['选项1']
};
exports.reducer = redux_actions_1.handleActions(_defineProperty({}, action.ADD_STR, function (state, action) {
  state = Object.assign({}, state);
  state.list.push(action.payload);
  return state;
}), initialState);
/**
 * 合并reducers
 */
exports.frootReducer = redux_1.combineReducers({ state: exports.reducer });
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.frootReducer;
});