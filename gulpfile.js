// plugins
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    webpack = require('webpack-stream'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    gclean = require('gulp-clean'),
    cleanCSS = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    gulpsync = require('gulp-sync')(gulp),
    fs = require('fs'),
    totalTaskTime = require('gulp-total-task-time');

// server config
var serverConfig = {
  name: 'Dev Assets Server',
  root: ['./public'],
  port: 3000,
  livereload: true,
  debug: true
};

// paths
var path = {
  'dist': './public/sites',
  'src': './resources/sites'
};

// sites
var sites = getFolders(path.src);

// init totalTaskTime
totalTaskTime.init();

// tasks
gulp.task('serve', serve);
gulp.task('watch', watch);

gulp.task('clean', clean);
gulp.task('clean:styles', cleanStyles);
gulp.task('clean:scripts', cleanScripts);

gulp.task('dev', gulpsync.sync(['serve', 'watch']), compile);
gulp.task('compile', ['clean'], compile);
gulp.task('dist', ['clean:styles', 'clean:scripts'], build);

/**
 * StylesDev
 * Function to handle styles for development
 * @returns {*}
 */
function stylesDev(site) {
  var siteSrc = fs.existsSync(path.src + '/' + site + '/assets/scss/app.scss') ? site : 'default';
  log('[' + site + '] compile: styles');
  return gulp.src(path.src + '/' + siteSrc + '/assets/scss/*.scss')
      .pipe(sass({style: 'expanded'}).on('error', sass.logError))
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(gulp.dest(path.dist + '/' + site + '/css'))
      .pipe(connect.reload());
}

/**
 * StylesDist
 * Function to handle styles for production
 * @returns {*}
 */
function stylesDist() {
  return gulp.src(path.dist + '/**/*.css')
      .pipe(rename({suffix: '.min'}))
      .pipe(cleanCSS({debug: true}))
      .pipe(gulp.dest(path.dist))
      .pipe(connect.reload());
}

/**
 * ScriptsDev
 * Function to manage scripts
 * @returns {*}
 */
function scriptsDev(site) {
  var siteSrc = fs.existsSync(path.src + '/' + site + '/assets/js/app.js') ? site : 'default';
  log('[' + site + '] compile: scripts');

  return gulp.src(path.src + '/' + siteSrc + '/assets/js/*.js')
      .pipe(webpack())
      .pipe(concat('app.js'))
      .pipe(gulp.dest(path.dist + '/' + site + '/js'))
      .pipe(connect.reload());
}

/**
 * ScriptsDist
 * Function to manage scripts
 * @returns {*}
 */
function scriptsDist() {
  return gulp.src(path.dist + '/**/*.js')
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(path.dist));
}

/**
 * Compile
 * Function to compile all assets in sites
 */
function compile() {
  sites.map(function (site) {
    stylesDev(site);
    scriptsDev(site);
  });
}

/**
 * Clean
 * Function to clean dist files
 * @returns {*}
 */
function clean() {
  return gulp.src([path.dist], {read: false})
      .pipe(gclean());
}

function cleanStyles() {
  return gulp.src([path.dist + '/**/*.min.css'], {read: false})
      .pipe(gclean());
}

function cleanScripts() {
  return gulp.src([path.dist + '/**/*.min.js'], {read: false})
      .pipe(gclean());
}

/**
 * Build
 * Function to dist all assetsF
 * @returns {*}
 */
function build() {
  stylesDist();
  scriptsDist();
}

/**
 * Watch
 * Function to run watchers
 */
function watch() {
  // style files
  gulp.watch([path.src + '/**/*.scss', path.src + '/**/*.css'])
      .on('change', function (file) {
        var site = getSiteNameFromPath(file.path);
        log('[' + site + '] ' + file.type + ': ' + file.path);

        // site => default ? compile all sites
        if (site === 'default') {
          sites.map(function (current) {
            stylesDev(current);
          })
        } else {
          stylesDev(site);
        }
      });

  // script files
  gulp.watch(path.src + '/**/*.js')
      .on('change', function (file) {
        var site = getSiteNameFromPath(file.path);
        log('[' + site + '] ' + file.type + ': ' + file.path);

        // site => default ? compile all sites
        if (site === 'default') {
          sites.map(function (current) {
            scriptsDev(current);
          })
        } else {
          scriptsDev(site);
        }
      });
}

/**
 * Serve
 * Function to serve assets
 */
function serve() {
  connect.server(serverConfig);
}

// --------------
// UTIL FUNCTIONS
// --------------

/**
 * Log
 * @param message
 */
function log(message) {
  gutil.log(gutil.colors.cyan(message));
}

/**
 * GetSiteNameFromPath
 * @param path
 */
function getSiteNameFromPath(path) {
  return path.split('/sites/')[1].split('/')[0];
}

/**
 * GetFolders
 * @param dir
 * @returns {*}
 */
function getFolders(dir) {
  return fs.readdirSync(dir)
      .filter(function (folder) {
        return fs.statSync(dir + '/' + folder).isDirectory();
      });
}