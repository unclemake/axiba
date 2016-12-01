define("pages/error/index.js",function(require, exports, module) {
"use strict";
const React = require('react');
class Component extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            btnText: '点击我',
            btnNu: 1
        };
    }
    btnClick() {
        this.setState({
            btnNu: this.state.btnNu + 1
        });
    }
    render() {
        const { state } = this;
        return React.createElement("section", {className: "page=home"}, 
            React.createElement("h2", null, 
                "错误:", 
                this.props.status)
        );
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component;
});
//# sourceMappingURL=index.js.map
