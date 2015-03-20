var gulp = require('gulp');
var complex = require('gulp-escomplex');
var complexreporter = require('gulp-escomplex-reporter-html');
var jshint = require('gulp-jshint');

var pack = require('./package.json');

gulp.task('complexity', function ( ) {
  gulp.src([
    'index.js',
    'lib/*.js'
  ],
  {
    base: __dirname
  })
  .pipe(complex({
    packageName: pack.name,
    packageVersion: pack.version
  }))
  .pipe(complexreporter())
  .pipe(gulp.dest('complexity'));
});

gulp.task('jshint', function () {
  gulp.src([
    'index.js',
    'lib/*.js'
  ])
  .pipe(jshint({
    lookup: true
  }))
  .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('default', [ 'complexity', 'jshint' ], function () {

});
