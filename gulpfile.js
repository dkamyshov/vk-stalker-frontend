var gulp = require('gulp');
var webpack = require('webpack');
var commonConfig = require("./webpack.config.js");

var sass = require('gulp-sass');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');

gulp.task('sass', function() {
    return gulp.src('./src/main.scss')
        .pipe(sass())
        .pipe(cleanCSS({}))
        .pipe(rename('style.css'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('copy', function() {
    return gulp.src('./src/index.html')
        .pipe(gulp.dest('./dist'));
});

gulp.task('webpack', function(callback) {
    webpack(
        commonConfig,
        function(err, stats) {
            console.log("[webpack]", stats.toString());
        }
    );
});

const serverStaticDir = "C:\\CODING\\vk-watcher\\backend\\static";

gulp.task('deploy', function() {
    gulp.src('./dist/*').pipe(gulp.dest(serverStaticDir));
});

gulp.task('watch', function() {
    gulp.watch('./src/*.scss', ['sass', 'deploy']);
    gulp.watch('./src/*.html', ['copy', 'deploy']);

    gulp.watch('./dist/*', ['deploy']);
});


gulp.task('default', ['copy', 'sass', 'webpack', 'deploy', 'watch']);