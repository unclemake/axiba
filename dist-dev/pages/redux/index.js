define("pages/redux/index.js",function(require, exports, module) {
"use strict";
/**
* 预约中心
*/
const React = require('react');
const react_redux_1 = require('react-redux');
const redux_1 = require('redux');
const redux_thunk_1 = require('redux-thunk');
const reducer_1 = require('./reducer');
const component_1 = require('./component');
//创建store
const store = redux_1.createStore(reducer_1.frootReducer, redux_1.applyMiddleware(redux_thunk_1.default));
//渲染
class App extends React.PureComponent {
    render() {
        return React.createElement(react_redux_1.Provider, {store: store}, 
            React.createElement(component_1.default, null)
        );
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
});
//# sourceMappingURL=index.js.map
