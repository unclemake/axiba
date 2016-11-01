/**
 * action
 */
import { State } from './model';
import { createAction } from 'redux-actions';


/**
 * 添加字符串
 */
export const ADD_STR = 'ADD_STR';
export const addStr = createAction<String>(ADD_STR, args => args);
