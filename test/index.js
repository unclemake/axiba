"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const compile_1 = require('../src/compile');
// import '../src/server'
// console.log(axiba.webDev.get());
// console.log(compile.getNodeArray(['motion/_zoom', 'motion/_slide', 'react']));
(() => __awaiter(this, void 0, void 0, function* () {
    // axiba.openDev();
    compile_1.default.md5Build();
    // axiba.init();
    // axiba.watch();
}))();
// (async () => {
// await compile.packNodeDependencies(npmDep.dependenciesObjToArr({
//     "react": "^15.3.2"
// }));
//     await compile.makeMainFile();
// })();
// axiba.makeMainFile();
// describeClass('axiba', axiba, () => {
//     itClass('start', () => {
//         itAdd([], () => true);
//     });
// })
// run();
// "dependencies": {
//   "@types/express": "^4.0.33",
//   "@types/gulp": "^3.8.32",
//   "@types/gulp-util": "^3.0.29",
//   "@types/open": "0.0.29",
//   "@types/react": "^0.14.41",
//   "@types/through2": "^2.0.31",
//   "@types/vinyl-fs": "0.0.28",
//   "axiba-dependencies": "^1.0.2",
//   "axiba-npm-dependencies": "0.0.1",
//   "express": "^4.14.0",
//   "gulp": "^3.9.1",
//   "gulp-babel": "^6.1.2",
//   "gulp-concat": "^2.6.0",
//   "gulp-minify-css": "^1.2.4",
//   "gulp-util": "^3.0.7",
//   "open": "0.0.5",
//   "seajs": "^2.3.0",
//   "through2": "^2.0.1",
//   "babel-preset-es2015": "^6.16.0",
//   "gulp-typescript": "^2.13.6",
//   "gulp-less": "^3.1.0",
//   "gulp-uglify": "^2.0.0"
// }, 

//# sourceMappingURL=index.js.map
