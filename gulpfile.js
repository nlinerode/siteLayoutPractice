var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');

gulp.task('browserSync', function(){
  browserSync.init({
    server: true
  });
});

gulp.task('autoprefixer', function(){
  return gulp.src('css/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss([ autoprefixer()]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('css'));
});

gulp.task('sass', function(){
  return gulp.src('scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({
      stream:true
    }));
});

gulp.task('useref', function(){
  return gulp.src('public/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function(){
  return gulp.src('public/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'));
});

// gulp.task('fonts', function(){
//   return gulp.src('public/fonts/**/*')
//     .pipe(gulp.dest('dist/fonts'));
// });

gulp.task('clean:dist', function(){
  return del.sync('dist');
});

gulp.task('watch', ['browserSync', 'sass'], function(){
  gulp.watch('scss/**/*.scss', ['sass']);
  gulp.watch('*.html', browserSync.reload);
  gulp.watch('js/**/*.js', browserSync.reload);
});

gulp.task('default', function(callback){
  runSequence(['autoprefixer', 'sass', 'browserSync', 'watch'], callback);
});

gulp.task('build', function(callback){
  runSequence('clean:dist', ['sass', 'useref', 'images'], callback);
});