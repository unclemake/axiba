var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const axiba = require('../src/index');
// import * as typescript from 'typescript'
axiba.config.mainModules = [];
axiba.config.mainFile = [
    'components/egret/egret.min.js',
    'components/egret/egret.web.min.js',
    'components/egret/res/res.min.js',
    'components/egret/particle/particle.min.js',
    'components/egret/eui/eui.min.js',
    'components/egret/tween/tween.min.js'
];
axiba.config.merge = 'dist/pages/*/index-????????.js';
axiba.config.paths = {
    '@components': 'components'
};
(() => __awaiter(this, void 0, void 0, function* () {
    yield axiba.release();
    // await axiba.init();
    yield axiba.serverRun();
    axiba.watch();
}))();
// console.log(typescript);
// console.log(typescript("import * as axiba from '../src/index'; axiba.bind()"));
// function add() {
//     console.log(this);
//     // (function (global) {
//     //     console.log(global);
//     // }.call({}, (function () {
//     //     return this;
//     // }())))
//     (function () {
//         console.log(this);
//     }())
// }
// add.call({ a: 1 });
// console.log(/(?!假)真(?!dd)/.test('假真假'));
//# sourceMappingURL=index.js.map
