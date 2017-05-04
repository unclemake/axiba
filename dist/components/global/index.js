define("components/global/index.js",["react","react-dom","react-router-dom","../nav/index"],function(require, exports, module) {
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const React = require('react');
const ReactDOM = require('react-dom');
const react_router_dom_1 = require('react-router-dom');
const index_1 = require('../nav/index');
;
;
class RequireEnsure extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            page: React.createElement("div", null)
        };
    }
    requireEnsure(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let obj = yield require.ensure(url);
            let Page = obj['default'];
            this.state.page = React.createElement(Page, null);
            this.setState(this.state);
        });
    }
    render() {
        let { props, state } = this;
        return state.page;
    }
    componentDidMount() {
        this.requireEnsure(this.props.url);
    }
}
class AppRouter extends React.Component {
    requireEnsure(url) {
        return () => React.createElement(RequireEnsure, {url: url});
    }
    render() {
        let requireEnsure = this.requireEnsure;
        return (React.createElement(react_router_dom_1.HashRouter, null, React.createElement("section", {className: 'h100'}, React.createElement(index_1.default, null), React.createElement(react_router_dom_1.Redirect, {from: '/', to: '/react'}), React.createElement(react_router_dom_1.Route, {path: "/react", render: requireEnsure('pages/react/index.js')}), React.createElement(react_router_dom_1.Route, {path: "/test", render: requireEnsure('pages/test/index.js')}))));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AppRouter;
ReactDOM.render(React.createElement(AppRouter, null), document.getElementById('app'));
});
//# sourceMappingURL=index.js.map
