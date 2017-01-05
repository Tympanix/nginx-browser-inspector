const gulp = require('gulp');
const browsersync = require('browser-sync').create();
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
const gulpif = require('gulp-if');
const runSequence = require('run-sequence');

const APP = './app';
const OUT = './';

gulp.task('serve', function() {
    browsersync.init({
        port: 3000,
        server: {
            baseDir: OUT
        }
    });
});

gulp.task('build:concat', function () {
    return gulp.src(APP + '/index.html')
        .pipe(useref())
        .pipe(gulp.dest(OUT))
        .pipe(browsersync.reload({ stream:true }))
});

gulp.task('build:assets' , function () {
    return gulp.src('./bower_components/semantic/dist/themes/default/assets/**')
        .pipe(gulp.dest(OUT + '/css/themes/default/assets'))
});

gulp.task('build:static', function () {
    return gulp.src([APP + '/views/**/*', APP +'/img/**/*', APP + '/icons/**/*'], { base: './'})
        .pipe(gulp.dest(OUT))
        .pipe(browsersync.reload({ stream: true }))
});

gulp.task('build', function () {
    runSequence(['build:concat', 'build:static', 'build:assets'])
});

gulp.task('watch', function () {
    gulp.watch([APP + '/*.html', APP + '/**/*.css', APP + '/**/*.js'], ['build:concat']);
    gulp.watch([APP + '/views/**/*.html'], ['build:static']);
});

gulp.task('dev', function () {
    runSequence('build', 'serve', 'watch');
});

gulp.task('default', ['dev']);