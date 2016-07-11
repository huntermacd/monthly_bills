var gulp = require('gulp');
var babel = require('gulp-babel');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var exec = require('child_process').exec;

// transpile ES5 to ES6
gulp.task('babelify', function(){
    return gulp.src('raw/*.js')
        .pipe(babel())
        .pipe(gulp.dest('build'));
});

// compile dependencies into one file
gulp.task('browserify', function(){
    return browserify('build/script.js')
        .bundle()
        .pipe(source('script.js'))
        .pipe(gulp.dest('build'));
});

// run server
gulp.task('run-server', () => {
  exec('firebase serve', (err, stdout, stderr) => {
    if (err) {
      console.error(err);
    } else {
      console.log(stdout, stderr);
    }
  });
});

// transpile/compile on file save
gulp.watch('raw/*.js', ['babelify', 'browserify']);

// run all tasks
gulp.task('start', ['babelify', 'browserify', 'run-server']);
