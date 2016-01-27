var gulp = require('gulp');
var babel = require('gulp-babel');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('babelify', function(){
    return gulp.src('raw/*.js')
        .pipe(babel())
        .pipe(gulp.dest('build'));
});

gulp.task('browserify', function(){
    return browserify('build/script.js')
        .bundle()
        .pipe(source('script.js'))
        .pipe(gulp.dest('build'));
});

gulp.task('watch', function(){
    gulp.watch('raw/*.js', ['babelify', 'browserify']);
});