/*jslint node: true */
'use strict';
/**
 * Usage
 * gulp [task]  --env development
 */
const gulp = require('gulp'),
    minimist = require('minimist'),
    config = require('./gulpConfig'),
    $ = require('gulp-load-plugins')(),
    del = require('del'),
    webpack = require('webpack')
    ;

var defaults = {
    string: ['env'],
    default: {
        env: process.env.NODE_ENV || 'development'
    }
};
var options = minimist(process.argv.slice(2), defaults);
process.env.NODE_ENV = options.env;

/**
 * Compile explorer app and run nodemon
 */
gulp.task('dev', ['clean:build'], () => {
    var nodemonRef;
    var config = require("./explorer/config/webpack");
    webpack(config).watch(500, onWebpackCompleted(() => {
        nodemonRef
            ? nodemonRef.restart()
            : nodemonRef = $.nodemon();
    }));
});

gulp.task("set:test", () => {
    process.env.NODE_ENV = 'test';
});

gulp.task("build:explorer", (done) => {
    var config = require("./explorer/config/webpack");
    webpack(config).run(onWebpackCompleted(done));
});

gulp.task('build', ['build:explorer']);

gulp.task('test', ['test:gateway'/*, 'test:explorer'*/]);
/**
 * Run mocha with standard reporter 
 */
gulp.task('test:gateway', ['set:test'], () => {
    gulp.src(config.src.server.tests, { read: false })
        .pipe($.mocha(config.options.mocha))
        .on('end', () => {
            $.util.log($.util.colors.bgYellow('INFO:'), 'Mocha completed');
            process.exit();
        })
        .on('error', (err) => {
            $.util.log($.util.colors.bgRed('ERROR:'), $.util.colors.red(err.message));
            $.util.log('Stack:', $.util.colors.red(err.stack));
        });
});
/**
 * cleaning tasks
 * Clean temp folders: ./coverage, ./build
 */
gulp.task('clean:coverage', () => {
    return del(config.dirs.coverage);
});
gulp.task('clean:build', () => {
    return del(config.dirs.build);
});

gulp.task('clean', ['clean:coverage', 'clean:build']);
/**
 * default task for development
 * Runs gateway and explorer servers in dev mode
 */
gulp.task('default', ['dev']);
/**
 * hook task
 * Hook files before test
 */
gulp.task('test:pre', function () {
    return gulp.src(['./gateway/server/**/*.js'])
        .pipe($.istanbul())
        .pipe($.istanbul.hookRequire())
})
/**
 * coverage task
 * Run code coverage on server files
 */
gulp.task('test:coverage', ["set:test", "test:pre"], () => {
    return gulp.src(config.src.server.tests)
        .pipe($.mocha({
            reporter: 'mocha-junit-reporter',
            timeout: 5000,
            reporterOptions: {
                mochaFile: process.env.CIRCLE_TEST_REPORTS + '/junit/results.xml'
            }
        }))
        .on('error', (err) => {
            $.util.log($.util.colors.bgRed('ERROR:'), $.util.colors.red(err));
            process.exit(1);
        })
        .pipe($.istanbul.writeReports())
        .on('end', () => {
            process.exit(0);
        })
})
/**
 * CI testing task
 * Run coveralls after coverage files creation
 */
gulp.task('test:ci', ["test:coverage"], () => {
    return gulp.src('./coverage/lcov.info')
        .pipe($.coveralls())
})

function onWebpackCompleted(done) {
    return (err, stats) => {
        if (err) {
            $.util.log($.util.colors.bgRed('ERROR:'), $.util.colors.red(err));
        } else {
            var stat = stats.toString({ chunks: false, colors: true });
            console.log(stat + '\n');
        }
        if (done) {
            done(err);
        }
    }
}
