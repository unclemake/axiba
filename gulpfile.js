var gulp = require('gulp');
var gulpTypescript = require('gulp-typescript');

gulp.task('default', function () {

    gulp.watch('./**/*.?(tsx|ts)', function (event) {
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
            .pipe(gulpTypescript(tsconfig))
            .pipe(gulp.dest('./'));
    }
});

