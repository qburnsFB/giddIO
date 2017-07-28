var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    jshint       = require('gulp-jshint'),
    sass         = require('gulp-sass'),
    concat       = require('gulp-concat'),
    sourcemaps   = require('gulp-sourcemaps'),
    bs           = require('browser-sync').create(),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS     = require('gulp-clean-css'),
    uglify       = require('gulp-uglify'),
    pump         = require('pump'),
    gulp         = require('gulp'),
    babel        = require('gulp-babel');

input  = {
  'sass': 'assets/sass/**/*.scss',
  'javascript': 'assets/js/**/*.js',
  'vendorjs': 'assets/js/vendor/**/*.js',
  'css': 'assets/css/*.css',
  'jsmin' :'assets/*.js'
},

    output = {
      'stylesheets': 'assets/css',
      'javascript': 'assets'
    };

/* run the watch task when gulp is called without arguments */
gulp.task('default', ['watch']);

/* runs browsersync dev server */
gulp.task('browser-sync', ['sass'], function() {
  bs.init({
    server: {
      baseDir: "./"
    }
  });
});

/* run javascript through jshint */
gulp.task('jshint', function() {
  return gulp.src(input.javascript)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'));
});

/* compile scss files */
gulp.task('sass', function() {
  return gulp.src(input.sass)
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(gulp.dest(output.stylesheets))
      .pipe(bs.reload({stream: true}));
});

// minify js
gulp.task('compress', function (cb) {
  pump([
        gulp.src(input.jsmin),
        uglify(),
        gulp.dest(output.javascript)
      ],
      cb
  );
});

// minify css
gulp.task('minify-css', function() {
  return gulp.src(input.css)
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(gulp.dest(output.stylesheets));
});

/* concat javascript files, minify if --type production */
gulp.task('build-js', function() {
  return gulp.src(input.javascript)
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(concat('bundle.js'))
      .pipe(gulp.dest(output.javascript))
});

/* Watch these files for changes and run the task on update */
gulp.task('watch', ['browser-sync'], function() {
  gulp.watch(input.javascript, ['jshint', 'build-js']);
  gulp.watch(input.sass, ['sass']);
  gulp.watch("*.html").on('change', bs.reload);
});