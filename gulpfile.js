var gulp = require('gulp');
var stylus = require('gulp-stylus');
var jeet = require('jeet');
var connect = require('gulp-connect');
var jade = require('gulp-jade');
var sourcemaps = require('gulp-sourcemaps');
var consolidate = require('gulp-consolidate');
var iconfont = require('gulp-iconfont');
var rename = require("gulp-rename");


gulp.task('css', function() {
    gulp.src('./src/css/styles.styl')
        .pipe(sourcemaps.init())
        .pipe(stylus({
            use: [jeet()],
            compress: true
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload());
});

gulp.task('connect', function() {
    connect.server({
        root: ['./dist'],
        livereload: true
    });
});

gulp.task('templates', function() {
    gulp.src('./src/templates/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('./dist/'))
        .pipe(connect.reload());
});

gulp.task('iconfont', function(){
    return gulp.src(['src/img/icons/*.svg'])
        .pipe(iconfont({ fontName: 'icons' }))
        .on('glyphs', function(glyphs, options) {
            gulp.src('./src/css/template.styl')
                .pipe(consolidate('lodash', {
                    glyphs: glyphs,
                    fontName: 'icons',
                    fontPath: '../fonts/',
                    className: 's'
                }))
                .pipe(rename({ basename: 'icons' }))
                .pipe(gulp.dest('src/css/'));
        })
        .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('watch', function() {
    gulp.watch(['src/css/**/*.styl'], ['css']);
    gulp.watch(['src/templates/*.jade'], ['templates']);
});

gulp.task('default', ['css', 'templates' ,'connect', 'watch'])
