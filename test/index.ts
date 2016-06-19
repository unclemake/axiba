/// <reference path="util.ts" />
/// <type="system" />
"use strict"
//测试


var argv = process.argv.slice(2)[0] || 'task';
require('./' + argv);

//制作素材图片代码

//var sizeOf = require('image-size');
//gulp.src('img/*.*').pipe((function () {

//    return through.obj(function (file, enc, cb) {

//        var extname = path.extname(file.path);
//        var dirname = path.dirname(file.path);

//        sizeOf(file.path, function (err, dimensions) {

//            var size: any = file.contents.length;
//            if (size < 1024 * 1024 && size > 1024) {
//                size = (size / 1024).toFixed(2) + 'kb'
//            } else if (size > 1024 * 1024) {
//                size = (size / 1024 / 1024).toFixed(2) + 'mb'
//            } else if (size < 1024) {
//                size = (size) + 'b';
//            }

//            file.path = dirname + '/[' + dimensions.width + ',' + dimensions.height + ']' + '[' + size + ']' + extname;

//            cb(null, file);
//        })

//    });
//} ())).pipe(gulp.dest('img2'));
