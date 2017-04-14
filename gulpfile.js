'use strict';
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const istanbul = require('gulp-istanbul');
const mocha = require('gulp-mocha');

const libFiles = ['index.js', 'lib/**/*.js'];
const binFiles = ['bin/index.js'];
const testFiles = ['test/**/*.js'];
const allFiles = libFiles.concat(testFiles).concat(binFiles);

gulp.task('pre-test', () => {
  return gulp.src(libFiles)
             // Covering files
             .pipe(istanbul())
             // Force `require` to return covered files
             .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], () => {
  return gulp.src(testFiles)
             .pipe(mocha())
             // Creating the reports after tests ran
             .pipe(istanbul.writeReports())
             // Enforce a coverage of at least 90%
             .pipe(istanbul.enforceThresholds({thresholds: {global: 70}}));

});

gulp.task('lint', () => {
  return gulp.src(allFiles)
             .pipe(eslint())
             .pipe(eslint.format())
             .pipe(eslint.failOnError())
});

gulp.task('default', ['lint']);
