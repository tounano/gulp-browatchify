'use strict';
var gulp  = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('./index');

gulp.task('browserify', function () {
  gulp.src('./examples/js/app.js')
    .pipe(browserify())
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./examples'))
})
gulp.watch('./examples/js/*.js', ['browserify']);


gulp.task('default', ['browserify']);
