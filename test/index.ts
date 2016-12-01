
import compile from '../src/compile';
import * as axiba from '../src/index';
import { describe, describeClass, its, run, it, itAdd, itClass } from 'axiba-unit-test';
import * as gulp from 'gulp';
import * as fs from 'fs';
// import '../src/server'


// console.log(axiba.webDev.get());


// console.log(compile.getNodeArray(['motion/_zoom', 'motion/_slide', 'react']));




(async () => {
  // axiba.openDev();

  // await axiba.init();
  axiba.config.devWatchPort = 668;

  await axiba.bulid();
  axiba.watch();

  // await axiba.bulid(false);
  // axiba.watch(false);
})();



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