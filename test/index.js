"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const index_1 = require('../src/index');
const axiba_npm_dependencies_1 = require('axiba-npm-dependencies');
// import '../src/server'
index_1.default.start();
(() => __awaiter(this, void 0, void 0, function* () {
    yield index_1.default.packNodeDependencies(axiba_npm_dependencies_1.default.dependenciesObjToArr({
        "react": "^15.3.2"
    }));
    yield index_1.default.makeMainFile();
}))();
// describeClass('axiba', axiba, () => {
//     itClass('start', () => {
//         itAdd([], () => true);
//     });
// })
// run(); 

//# sourceMappingURL=index.js.map
