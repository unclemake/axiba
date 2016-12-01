define("components/global/index.js",function(require, exports, module) {
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const React = require('react');
const ReactDOM = require('react-dom');
const react_router_1 = require('react-router');
const index_1 = require('../nav/index');
class Main extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            loading: 0,
            page: React.createElement("div", null)
        };
        this.asyncRender = false;
    }
    asyncLoading() {
        this.asyncRender = false;
        let props = this.props;
        // 自动解析
        let url = props.route.path === '*' ?
            'pages' + props.location.pathname + '/index.js' : 'pages/' + props.route.path + '/index.js';
        if (window.__md5Array) {
            let md5obj = __md5Array.find(value => value.path === url);
            if (md5obj) {
                url = md5obj.md5;
            }
        }
        console.log('加载：' + url);
        this.state.loading = 0;
        this.setState(this.state);
        setTimeout(() => {
            this.state.loading = 1;
            this.setState(this.state);
        }, 0);
        require.async(url, (mod) => {
            this.state.loading = 2;
            if (mod) {
                let Com = mod.default;
                this.state.page = React.createElement(Com, null);
                this.setState(this.state);
            }
            else {
                require.async('../../pages/error/index.js', (mod) => {
                    let Com = mod.default;
                    this.state.page = React.createElement(Com, {status: 404});
                    this.setState(this.state);
                });
            }
        });
    }
    componentWillReceiveProps(nextProps) {
        let oldLocation = this.props.location;
        let location = nextProps.location;
        if (oldLocation.pathname != location.pathname || oldLocation.search != location.search) {
            this.asyncRender = true;
        }
    }
    componentDidUpdate() {
        if (this.asyncRender) {
            this.asyncLoading();
        }
    }
    componentDidMount() {
        this.asyncLoading();
    }
    getLoadingClass() {
        switch (this.state.loading) {
            case 0:
                return '';
            case 1:
                return 'loading-box-loading';
            case 2:
                return 'loading-box-complete';
        }
    }
    render() {
        return React.createElement("div", {className: 'h100'}, 
            React.createElement(index_1.default, null), 
            React.createElement("div", {className: "loading-box " + this.getLoadingClass()}, 
                React.createElement("div", {className: "loading-box-inner"})
            ), 
            React.createElement("main", null, this.state.page));
    }
}
class AppRouter extends React.Component {
    async(text) {
        return (obj, callback) => {
            callback(null, (prop) => {
                return React.createElement(Main, __assign({}, prop));
            });
        };
    }
    render() {
        return (React.createElement("section", {className: 'h100'}, 
            React.createElement(react_router_1.Router, {history: react_router_1.hashHistory}, 
                React.createElement(react_router_1.Redirect, {from: '/', to: '/react'}), 
                React.createElement(react_router_1.Route, {path: 'dang', component: Main}), 
                React.createElement(react_router_1.Route, {path: '*', component: Main}))
        ));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AppRouter;
ReactDOM.render(React.createElement(AppRouter, null), document.getElementById('app'));
});
//# sourceMappingURL=index.js.map
