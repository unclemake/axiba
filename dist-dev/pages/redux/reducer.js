define("pages/redux/reducer.js",function(require, exports, module) {
"use strict";
/**
 * reducer
 */
const redux_actions_1 = require('redux-actions');
const action = require('./action');
const redux_1 = require('redux');
/**
 * 默认数据
 */
const initialState = {
    list: ['选项1']
};
exports.reducer = redux_actions_1.handleActions({
    [action.ADD_STR]: (state, action) => {
        state = Object.assign({}, state);
        state.list.push(action.payload);
        return state;
    }
}, initialState);
/**
 * 合并reducers
 */
exports.frootReducer = redux_1.combineReducers({ state: exports.reducer });
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.frootReducer;
});
//# sourceMappingURL=reducer.js.map
