// plugins
var gulp = require('gulp'),
    webpack = require('webpack-stream'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    gclean = require('gulp-clean'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload');

// paths
var path = {
  dist: {
    styles: 'public/css',
    scripts: 'public/js'
  },
  src: {
    styles: 'resources/assets/scss',
    scripts: 'resources/assets/js'
  }
};

// tasks
gulp.task('clean', clean);
gulp.task('watch', watch);
gulp.task('styles:dev', stylesDev);
gulp.task('styles:dist', stylesDist);
gulp.task('scripts:dev', scriptsDev);
gulp.task('scripts:dist', scriptsDist);
gulp.task('compile:dev', ['clean'], compileDev);
gulp.task('compile:dist', compileDist);

gulp.task('dev', dev);
gulp.task('build', build);

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
 * CompileDev
 * Function to run styles and scripts compile tasks for development
 */
function compileDev() {
  gulp.run('styles:dev', 'scripts:dev');
}

/**
 * CompileDist
 * Function to run styles and scripts compile tasks for production
 */
function compileDist() {
  gulp.run('styles:dist', 'scripts:dist');
}

/**
 * Dev
 * Function to run dev tasks
 */
function dev() {
  gulp.run('compile:dev', 'watch');
}


/**
 * Build
 * Function to run build tasks
 */
function build() {
  gulp.run('compile:dist');
}

/**
 * Watch
 * Function to run watchers
 */
function watch() {
  // style files
  gulp.watch(path.src.styles + '/' + '**/*.scss', function (event) {
    livereload.listen();
    console.log('File ' + event.path + ' was ' + event.type);
    gulp.run('styles:dev');
  });

  // script files
  gulp.watch(path.src.scripts + '/' + '**/*.js', function (event) {
    livereload.listen();
    console.log('File ' + event.path + ' was ' + event.type);
    gulp.run('scripts:dev');
  });
}
