var gulp = require('gulp');
var less = require('gulp-less');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var del = require('del');

var paths = {
  styles: {
    src: 'src/styles/**/*.less',
    dest: 'build/styles/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'build/scripts/'
  }
};

function clean() {
  return del(['assets']);
}

function styles() {
  return (
    gulp
      .src(paths.styles.src)
      .pipe(less())
      .pipe(cleanCSS())
      // pass in options to the stream
      .pipe(
        rename({
          basename: 'main',
          suffix: '.min'
        })
      )
      .pipe(gulp.dest(paths.styles.dest))
  );
}

function scripts() {
  return gulp
    .src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

function watch() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
}

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;

var build = gulp.series(clean, gulp.parallel(styles, scripts));

gulp.task('build', build);

gulp.task('default', build);
