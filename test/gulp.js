"use strict";
/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="axiba.ts" />
/// <type="system" />
const gulp_1 = require('../lib/gulp');
var concat = require('gulp-concat');
var through = require('through2');
gulp_1.default.getVinylByUrl([
    "assets/components/seajs/2.3.0/sea.js",
    "assets/components/seajs-css/1.0.5/src/seajs-css.js ",
    "assets/components/seajs-text/1.1.1/src/seajs-text.js ",
    "assets/components/global/1.0/seajsConfig.js",
]).then((vinyl) => {
    var stream = gulp_1.default.getStream(vinyl).pipe(test()).pipe(test2());
    gulp_1.default.onFinish(stream).then(() => {
        console.log('哈哈哈哈');
    });
});
var test = () => {
    return through.obj((file, enc, cb) => {
        console.log('1');
        cb(null, file);
    });
};
var test2 = () => {
    return through.obj((file, enc, cb) => {
        console.log('2');
        cb(null, file);
    });
};
//plog(uglify.concatByArr());
//git.pull();
//git.push();
//git.add();
//git.commit();
//uglify.uglify();
//uglify.watch();
