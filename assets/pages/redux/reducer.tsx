/**
 * reducer
 */
import { handleActions, Action } from 'redux-actions';
import { State } from './model';
import * as action from './action';
import { combineReducers } from 'redux';

/**
 * 默认数据
 */
const initialState: State = {
    list: ['选项1']
};

export const reducer = handleActions<State, any>({
    [action.ADD_STR]: (state: State, action: Action<string>): State => {
        state = Object.assign({}, state);

        state.list.push(action.payload)
        
        return state;
    }
}, initialState);


/**
 * 合并reducers
 */
export const frootReducer = combineReducers({ state: reducer });
export default frootReducer

