var gulp = require('gulp');
var stylus = require('gulp-stylus');
var jeet = require('jeet');
var browserSync = require('browser-sync').create();
var mustache = require('gulp-mustache');
var sourcemaps = require('gulp-sourcemaps');
var consolidate = require('gulp-consolidate');
var iconfont = require('gulp-iconfont');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var rupture = require('rupture');

gulp.task('images', function() {
    return gulp.src('./src/img/*')
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 7,
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./dist/img/'));
});

gulp.task('copy', function() {
    gulp.src('./src/fonts/*')
        .pipe(gulp.dest('./dist/fonts/'));
});

gulp.task('css', function() {
    gulp.src('./src/css/styles.styl')
        .pipe(sourcemaps.init())
        .pipe(stylus({
            use: [jeet(), rupture()],
            compress: false
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('browsersync', function() {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });
});

gulp.task('templates', function() {
    gulp.src('./src/templates/*.mustache')
        .pipe(mustache({}, {extension: '.html'}))
        .pipe(gulp.dest('./dist/'))
        .pipe(browserSync.stream());
});

gulp.task('iconfont', function(){
    return gulp.src(['src/img/icons/*.svg'])
        .pipe(iconfont({ fontName: 'icons' }))
        .on('glyphs', function(glyphs, options) {
            gulp.src('./src/css/template.styl')
                .pipe(consolidate('lodash', {
                    glyphs: glyphs,
                    fontName: 'icons',
                    className: 'i'
                }))
                .pipe(rename({ basename: 'icons' }))
                .pipe(gulp.dest('src/css/common/'));
        })
        .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('watch', function() {
    gulp.watch(['src/css/**/*.styl'], ['css']);
    gulp.watch(['src/templates/**/*.mustache'], ['templates']);
});

gulp.task('default', ['css', 'copy', 'images', 'templates', 'browsersync', 'watch'])
