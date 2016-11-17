var gulp = require('gulp');
var gulpTypescript = require('gulp-typescript');
var jsdoc = require("gulp-jsdoc3");
const sourcemaps = require('gulp-sourcemaps');;
const through = require('through2');;
const ph = require('path');;
const fs = require('fs');;

gulp.task('build', function () {

    return gulp.watch(['src/**/*.?(tsx|ts)', 'test/**/*.?(tsx|ts)'], function (event) {
        console.log(event.path);
        ts(event.path);
    });

    /**
  * ts解析 
  * @param path 连接
  */
    function ts(pathArr) {
        var tsconfig = require('./tsconfig.json').compilerOptions;
        return gulp
            .src(pathArr, {
                base: './'
            })
            .pipe(sourcemaps.init())
            .pipe(gulpTypescript(tsconfig))
            .pipe(sourcemaps.write('./', { includeContent: false, sourceRoot: '../' }))
            .pipe(gulp.dest('./'));
    }
});

gulp.task('jsdoc', function (cb) {
    return gulp.src(['README.md', './src/**/*.js'], { read: false })
        .pipe(jsdoc());
})


gulp.task('antd', function (cb) {
    function antd() {
        return through.obj((file, enc, callback) => {
            var content = file.contents.toString();
            content = content.replace(/import React from 'react';/g, `import * as React from 'react';`);
            content = content.replace(/import classNames from 'classnames';/g, `import * as classNames from 'classnames';`);
            content = content.replace(/import warning from 'warning';/g, `import * as warning from 'warning';`);
            content = content.replace(/null = null/g, `null`);

            content = content.replace(/React.FormEventHandler/g, `React.FormEventHandler<any>`);

            file.contents = new Buffer(content);
            callback(null, file);
        })
    }

    return gulp.src(['node_modules/antd/**/*.d.ts'], {
        base: './'
    })
        .pipe(antd())
        .pipe(gulp.dest('./'));

})


gulp.task('antdless', function (cb) {
    function antd() {
        return through.obj((file, enc, callback) => {
            var content = file.contents.toString();
            let extname = ph.extname(file.path);
            let dirname = ph.dirname(file.path);
            let basename = ph.basename(file.path);

            content = content.replace(/@import +['"](.+?)['"]/g, (str, $1) => {
                let extname = ph.extname($1);
                let dirname = ph.dirname($1);
                let basename = ph.basename($1);
                if (basename === 'index.less' || basename === 'index') {
                    return str;
                } else {
                    basename = '_' + basename;
                    return `@import "${dirname}/${basename}"`;
                }
            });

            if (basename !== 'index.less') {
                fs.unlinkSync(file.path);
                file.path = `${dirname}/_${basename}`;
            }

            file.contents = new Buffer(content);
            callback(null, file);
        })
    }

    return gulp.src(['./assets/components/antd/**/*.less'], {
        base: './'
    })
        .pipe(antd())
        .pipe(gulp.dest('./'));

})



gulp.task('antddel', function (cb) {
    function antd() {
        return through.obj((file, enc, callback) => {
            let extname = ph.extname(file.path);
            if (extname != '.less') {
                fs.unlinkSync(file.path);
            }
            callback(null);
        })
    }

    return gulp.src(['./assets/components/antd/**/*.*'], {
        base: './'
    })
        .pipe(antd())
        .pipe(gulp.dest('./dddd'));

})





