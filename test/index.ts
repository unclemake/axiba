
import * as axiba from '../src/index'



// import * as typescript from 'typescript'

axiba.config.mainModules = [];

axiba.config.mainFile = [
    // 'components/egret/egret.min.js',
    // 'components/egret/egret.web.min.js',
    // 'components/egret/res/res.min.js',
    // 'components/egret/particle/particle.min.js',
    // 'components/egret/eui/eui.min.js',
    // 'components/egret/tween/tween.min.js'
];

axiba.config.merge = 'dist/pages/*/index-????????.js';

axiba.config.paths = {
    '@components': 'components'
};


(async () => {


    await axiba.release();
    // await axiba.init();

    await axiba.serverRun();
    axiba.watch();
})()

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
