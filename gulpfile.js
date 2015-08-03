

(function() {
  'use strict';
  require('harmonize')(['es_staging', 'harmony_modules', 'harmony_classes']);

  const gulp = require('gulp');
  const mocha = require('gulp-mocha');

  gulp.task('test', function () {
    return gulp.src('test/*.js', {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha());
  });
}());
