define("components/global/index.js",["react","react-dom","react-router-dom","../nav/index","react-redux","redux","core-decorators","../antd/index"],function(require, exports, module) {
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const react_router_dom_1 = require("react-router-dom");
const index_1 = require("../nav/index");
const react_redux_1 = require("react-redux");
const redux_1 = require("redux");
const core_decorators_1 = require("core-decorators");
const index_2 = require("../antd/index");
// 缓存页面数据
let saveState = {};
// acitons 列表
let acitonsList = {};
/**
 * 获取strie
 *
 * @returns
 */
function getStore() {
    const rootReducer = redux_1.combineReducers(acitonsList);
    const store = redux_1.createStore(rootReducer, saveState);
    return store;
}
;
;
let RequireEnsure = class RequireEnsure extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            page: React.createElement("div", null),
            loading: true
        };
    }
    requireEnsure(url) {
        return __awaiter(this, void 0, void 0, function* () {
            // <debug>
            // 此行会在发布中删除
            console.log(url);
            // </debug>
            this.state.loading = true;
            this.setState(this.state);
            let path = this.props.router.match.path;
            let obj = yield require.ensure(url);
            // 获取页面
            let Page = obj['default'];
            // 获取reducer
            acitonsList[path] = obj['reducer'];
            const store = getStore();
            const mapStateToProps = state => {
                // 保存每个页面的state
                saveState = state;
                return ({
                    data: state[path]
                });
            };
            // 提取data
            let App = react_redux_1.connect(mapStateToProps)(Page);
            this.state.page = React.createElement(react_redux_1.Provider, { store: store },
                React.createElement(App, { router: this.props.router, store: store }));
            this.state.loading = false;
            this.setState(this.state);
        });
    }
    render() {
        let { props, state } = this;
        return state.loading ? React.createElement("div", { style: { textAlign: 'center', paddingTop: '100px' } },
            React.createElement(index_2.Spin, null)) : state.page;
    }
    /**
     * 重加载
     *
     * @param {any} url
     * @returns
     *
     * @memberOf RequireEnsure
     */
    reload(url) {
        return __awaiter(this, void 0, void 0, function* () {
            if (url === 'dist/index.js') {
                window.location.reload();
                return;
            }
            let bl = yield window['axibaModular'].reload(url);
            if (bl) {
                if (url !== this.props.url) {
                    yield window['axibaModular'].reload(this.props.url);
                }
                this.requireEnsure(this.props.url);
            }
        });
    }
    componentWillUpdate(nextProps) {
        if (nextProps.url !== this.props.url) {
            // 渲染完毕再改变 不然this.props.router.match.path值不对
            setTimeout(() => {
                this.requireEnsure(nextProps.url);
            }, 0);
        }
    }
    componentDidMount() {
        this.requireEnsure(this.props.url);
        window['__reload'] = this.reload;
    }
};
RequireEnsure = __decorate([
    core_decorators_1.autobind
], RequireEnsure);
class AppRouter extends React.Component {
    requireEnsure(url) {
        return (props) => React.createElement(RequireEnsure, { url: url, router: props });
    }
    render() {
        let requireEnsure = this.requireEnsure;
        return (React.createElement(react_router_dom_1.HashRouter, null,
            React.createElement("section", { className: 'h100' },
                React.createElement(index_1.default, null),
                React.createElement(react_router_dom_1.Switch, null,
                    React.createElement(react_router_dom_1.Route, { exact: true, path: "/", render: requireEnsure('pages/react/index.js') }),
                    React.createElement(react_router_dom_1.Route, { path: "/test", render: requireEnsure('pages/test/index.js') }),
                    React.createElement(react_router_dom_1.Route, { path: "/antd", render: requireEnsure('pages/antd/index.js') }),
                    React.createElement(react_router_dom_1.Route, { render: requireEnsure('pages/error/index.js') })))));
    }
}
exports.default = AppRouter;
ReactDOM.render(React.createElement(AppRouter, null), document.getElementById('app'));
});
//# sourceMappingURL=index.js.map
