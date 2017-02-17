// plugins
var gulp = require('gulp'),
    express = require('express'),
    webpack = require('webpack-stream'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    gclean = require('gulp-clean'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect');

var serverPort = 5001;

// paths
var path = {
  dist: {
    styles: './public/css',
    scripts: './public/js'
  },
  src: {
    styles: './resources/assets/scss',
    scripts: './resources/assets/js'
  }
};

// tasks
gulp.task('clean', clean);
gulp.task('serve', serve);
gulp.task('watch', watch);
gulp.task('styles:dev', stylesDev);
gulp.task('styles:dist', stylesDist);
gulp.task('scripts:dev', scriptsDev);
gulp.task('scripts:dist', scriptsDist);

gulp.task('dev', ['serve', 'clean', 'styles:dev', 'scripts:dev', 'watch']);
gulp.task('build', ['styles:dist', 'scripts:dist']);

/**
 * StylesDev
 * Function to handle styles for development
 * @returns {*}
 */
function stylesDev() {
  return gulp.src(path.src.styles + '/' + '**/*.scss')
      .pipe(sass({style: 'expanded'}).on('error', sass.logError))
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(gulp.dest(path.dist.styles))
      .pipe(connect.reload());
}

/**
 * StylesDist
 * Function to handle styles for production
 * @returns {*}
 */
function stylesDist() {
  return gulp.src(path.dist.styles + '/' + 'app.css')
      .pipe(minifycss())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(path.dist.styles));
}

/**
 * ScriptsDev
 * Function to manage scripts
 * @returns {*}
 */
function scriptsDev() {
  return gulp.src(path.src.scripts + '/' + 'app.js')
      .pipe(webpack())
      .pipe(concat('bundle.js'))
      .pipe(gulp.dest(path.dist.scripts))
      .pipe(connect.reload());
}

/**
 * ScriptsDist
 * Function to manage scripts
 * @returns {*}
 */
function scriptsDist() {
  return gulp.src(path.src.scripts + '/' + 'app.js')
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(path.dist.scripts));
  // .pipe(notify({message: 'Scripts task complete'}));
}

/**
 * Clean
 * Function to clean dist files
 * @returns {*}
 */
function clean() {
  return gulp.src([path.dist.styles, path.dist.scripts], {read: false})
      .pipe(gclean());
}

/**
 * Watch
 * Function to run watchers
 */
function watch() {
  // style files
  gulp.watch(path.src.styles + '/' + '**/*.scss', ['styles:dev']);

  // script files
  gulp.watch(path.src.scripts + '/' + '**/*.js', ['scripts:dev']);
}

/**
 * Serve
 * Function to serve assets
 */
function serve() {
  connect.server({
    name: 'Dev Server',
    root: ['public'],
    port: serverPort,
    livereload: true
  })
}