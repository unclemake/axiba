define("pages/redux/component.js",function(require, exports, module) {
"use strict";
/**
* 预约中心
*/
const React = require('react');
const index_1 = require('../../components/button/index');
const index_2 = require('../../components/input/index');
const react_redux_1 = require('react-redux');
const action = require('./action');
require('./index.css');
class App extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            str: '',
            a: 1,
        };
    }
    change(e) {
        // this.state.str = e.target.value;
        this.setState({
            str: e.target.value
        });
    }
    render() {
        const { state, dispatch } = this.props;
        return React.createElement("section", {className: 'page-redux'}, 
            React.createElement("h2", null, "redux"), 
            React.createElement(index_2.default, {placeholder: '填写', value: this.state.str, onChange: this.change.bind(this)}), 
            React.createElement(index_1.default, {onClick: () => dispatch(action.addStr(this.state.str))}, "添加"), 
            React.createElement("h3", null, "列表"), 
            React.createElement("ul", null, state.list.map((value, index) => React.createElement("li", {key: index}, value))), 
            React.createElement("h3", null, "样式"), 
            React.createElement("p", {className: 'css1'}, "样式"));
    }
}
// 导出
const mapStateToProps = state => state;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps)(App);
});
//# sourceMappingURL=component.js.map
