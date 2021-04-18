// REQUIREMENTS
const { task, src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const php = require('gulp-connect-php');
const browserSync = require('browser-sync').create();

// PATHS
const pathSourceSass = './src/scss/'
const pathDestCss = './build/css/'

const pathSourceJs = './src/js/'
const pathDestJs = './build/js/'

// BROWSER SYNC
task('browserSync', () => {

  // PS.You need to activate your PHP Path
  php.server({
    base: './',
    port: 3000,
    keepalive: true,
    // custom PHP locations
    bin: 'C:/wamp64/bin/php/php7.4.0/php.exe',
    ini: 'C:/wamp64/bin/php/php7.4.0/php.ini',
  });
  browserSync.init({
    proxy: "localhost:3000",
    baseDir: "./",
    notify: false,
  });

});

// TASKS
task('compileSass', () => {
  return src(pathSourceSass + '*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(rename({ extname: ".min.css" }))
    .pipe(sourcemaps.write())
    .pipe(dest(pathDestCss))
    .pipe(browserSync.stream());
});

task('compileJs', () => {
  return src(pathSourceJs + '*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write())
    .pipe(dest(pathDestJs))
    .pipe(browserSync.stream());
});

// WATCH
task('watchSass', () => {
  watch(pathSourceSass + '*.scss', series('compileSass'))
})

task('watchJs', () => {
  watch(pathSourceJs + '*.js', series('compileJs'))
})

task('watchPhp', () => {
  watch(['./**/*.html', './**/*.php']).on('change', browserSync.reload);
})

// DEFAULT
task('default', series('compileSass', 'compileJs', parallel('browserSync', 'watchSass', 'watchJs', 'watchPhp')))