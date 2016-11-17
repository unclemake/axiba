define("pages/ajax/index.js",function(require, exports, module) {"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const React = require('react');
const index_1 = require('../../components/ajax/index');
const index_2 = require('../../components/button/index');
/**
 * ajax demo
 *
 * @export
 * @class Component
 * @extends {React.Component<any, any>}
 */
class Component extends React.Component {
    constructor() {
        super(...arguments);
        /**
         * 状态保存log
         *
         *
         * @memberOf Component
         */
        this.state = {
            text: []
        };
    }
    /**
     * log输出
     *
     * @param {any} msg
     *
     * @memberOf Component
     */
    log(msg) {
        this.state.text.push(msg);
        this.setState(this.state);
    }
    /**
     * 第一个按钮
     *
     *
     * @memberOf Component
     */
    getAjax() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('默认400毫秒只能调用一次');
            this.log('调用第一次');
            /**
             *
             *
             * @param {any} res
             */
            let res = index_1.get('assets/components/nav/index.tsx').then(res => {
                this.log('调用第一次成功');
                this.log('-------');
            });
            this.log('调用第二次');
            index_1.get('assets/components/nav/index.tsx').then(res => {
                this.setState(this.state);
                this.log('调用第二次成功');
            });
        });
    }
    /**
     * 第二个按钮
     * 当按钮点击事件 返回的是 Promise 会有个loading
     * @returns
     *
     * @memberOf Component
     */
    getAjax1() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('缓存');
            this.log('调用第一次');
            let res = yield index_1.get('assets/components/nav/index.tsx', null, 1);
            this.log('调用第一次成功');
            this.log('调用第二次');
            return index_1.get('assets/components/nav/index.tsx', null, 1).then(res => {
                this.log('调用第二次成功');
                this.log('-------');
            });
        });
    }
    /**
     * 第三个按钮
     * 当按钮点击事件 返回的是 Promise 会有个loading
     * @returns
     *
     * @memberOf Component
     */
    getAjax2() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('延迟提交 400ms 只提交最后一次ajax');
            this.log('调用第一次');
            /**
             *
             *
             * @param {any} res
             */
            let res = index_1.get('assets/components/nav/index.tsx', null, 2).then(res => {
                this.log('调用第一次成功');
            });
            this.log('调用第二次');
            return index_1.get('assets/components/nav/index.tsx', null, 2).then(res => {
                this.log('调用第二次成功');
                this.log('-------');
            });
        });
    }
    /**
     * 渲染
     *
     * @returns
     *
     * @memberOf Component
     */
    render() {
        return React.createElement("section", {className: 'page-home'}, 
            React.createElement("h2", null, "简单例子55"), 
            React.createElement("div", null, 
                React.createElement(index_2.default, {onClick: this.getAjax.bind(this)}, "get1"), 
                React.createElement(index_2.default, {onClick: this.getAjax1.bind(this)}, "get2"), 
                React.createElement(index_2.default, {onClick: this.getAjax2.bind(this)}, "get3")), 
            this.state.text.map((value, index) => {
                return React.createElement("p", {key: index}, value);
            }));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component;
});
//# sourceMappingURL=index.js.map
