define("components/button/index.js",function(require, exports, module) {
"use strict";
const React = require('react');
require('../antd/button/style/index.css');
const index_1 = require('../spin/index');
let Button = require('antd/lib/button/index');
exports.Button = Button;
let SpinC = index_1.default;
class Component extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            loading: false
        };
    }
    onClick(e) {
        let onClickBack = this.props.onClick(e);
        let self = this;
        if (onClickBack && onClickBack.then) {
            self.state.loading = true;
            self.setState(self.state);
            return onClickBack.then(function (arg) {
                self.state.loading = false;
                self.setState(self.state);
                return arg;
            }, function (arg) {
                self.state.loading = false;
                self.setState(self.state);
                return arg;
            });
        }
        else {
            return onClickBack;
        }
    }
    render() {
        return (React.createElement(SpinC, {spinning: this.state.loading, size: "small", style: { display: 'inline-block' }}, 
            React.createElement(Button, {onClick: this.props.onClick ? this.onClick.bind(this) : () => { }}, this.props.children)
        ));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component;
});
//# sourceMappingURL=index.js.map
