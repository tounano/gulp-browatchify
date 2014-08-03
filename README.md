# gulp-browatchify

Browserify + Watchify the gulp way.

Use browserify + watchify in a clean way as you would do with any other gulp module.

## browatchify(?opts)

Opts can have any option that is acceptable by browserify.

The only additional option is `transforms`. You can include your array of transforms there.

```js
'use strict';
var gulp  = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('gulp-browatchify');
var reactify = require('reactify') // reactify transform

gulp.task('browserify', function () {
  gulp.src('./examples/js/app.js')
    .pipe(browserify({debug: !process.env.production, transforms:[reactify]}))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./examples'))
})
gulp.watch('./examples/js/*.js', ['browserify']);


gulp.task('default', ['browserify']);

```

## install

With [npm](https://npmjs.org) do:

```
npm install gulp-browatchify
```

## license

MIT
