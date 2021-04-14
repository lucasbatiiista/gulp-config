// REQUIREMENTS
const { task, src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

// PATHS
const pathWampLocalhost = 'learning/others/project-gulp/'

const pathSourceSass = './src/scss/'
const pathDestCss = './build/css/'

const pathSourceJs = './src/js/'
const pathDestJs = './build/js/'

// BROWSER SYNC
task('browserSync', () => {
  browserSync.init({
    proxy: pathWampLocalhost
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
  watch('./src/scss/*.scss', series('compileSass'))
})

task('watchJs', () => {
  watch('./src/js/*.js', series('compileJs'))
})

task('watchPhp', () => {
  watch(['./**/*.html', './**/*.php']).on('change', browserSync.reload);
})

// DEFAULT
task('default', series('compileSass', 'compileJs', parallel('browserSync', 'watchSass', 'watchJs', 'watchPhp')))