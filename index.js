'use strict';

var browserify  = require('browserify'),
    watchify    = require('watchify'),
    _           = require('underscore'),
    gutil       = require('gulp-util'),
    through2    = require('through2');

var cache = {},
    bundlers = {};

module.exports = function (opts) {
  opts = opts || {};
  return through2(
    {objectMode: true},
    function (file, enc, cb) {
      var self = this;
      var bundler = getBundler(file, opts);
      ;(function rebundle() {
        if (!cache[file.path]) return setImmediate(function (){ rebundle(); });

        bundler.bundle()
          .on('error', function (e) {self.emit('error', e); cb(); })
          .on('data', function (d) {self.push(d)})
          .on('end', function () { delete cache[file.path]; setImmediate(function (){cb();})});
      })();
    }
  );
}

function getBundler(file, opts) {
  if (bundlers[file.path]) return bundlers[file.path];
  var _opts = _.clone(opts);
  var transforms = _opts.transforms;
  delete _opts.transforms;

  bundlers[file.path] =
    logBundler(applyTransforms(createBundler(file, _opts, true), transforms)).on('update', function(){ cache[file.path] = true;  });

  cache[file.path] = true;
  return getBundler(file, opts);
  //return logBundler(applyTransforms(createBundler(file, _opts, false), transforms));
}

function createBundler(file, opts, watch) {
  return (watch ? watchify(browserify(file.path, _.extend(opts || {}, watchify.args))) : browserify(file.path, opts));
}

function applyTransforms (bundler, transforms) {
  transforms = transforms || [];

  _.each(transforms, function (t) {
    bundler.transform(t);
  })

  return bundler;
}

function logBundler(bundler) {
  return bundler.on('log', function (msg) { gutil.log('Browserify: ', msg)});
}
