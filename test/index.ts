
import axiba from '../src/index'
import { describe, describeClass, its, run, it, itAdd, itClass } from 'axiba-unit-test';
import { default as npmDep } from 'axiba-npm-dependencies';
import * as gulp from 'gulp';
// import '../src/server'

axiba.start();

(async () => {
    await axiba.packNodeDependencies(npmDep.dependenciesObjToArr({
        "react": "^15.3.2"
    }));

    await axiba.makeMainFile();
})();



// describeClass('axiba', axiba, () => {
//     itClass('start', () => {
//         itAdd([], () => true);
//     });
// })
// run();