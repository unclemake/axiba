var gulp = require('gulp');
var gulpTypescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');;
var typedoc = require("gulp-typedoc");

gulp.task('default', function () {

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
            .pipe(sourcemaps.write('./', { includeContent: false, sourceRoot: './' }))
            .pipe(gulp.dest('./'));
    }
});

gulp.task("docs", function () {
    return gulp
        .src(["./src/**/*.ts"])
        .pipe(typedoc({
            // TypeScript options (see typescript docs) 
            module: "commonjs",
            target: "es6",
            includeDeclarations: true,

            // Output options (see typedoc docs) 
            out: "./docs",
        }))
        ;
});
