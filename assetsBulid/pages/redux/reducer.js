"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

define("pages/redux/reducer.js", function (require, exports, module) {
  "use strict";
  /**
   * reducer
   */

  var redux_actions_1 = require('redux-actions');
  var action = require('./action');
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
//# sourceMappingURL=reducer.js.map
