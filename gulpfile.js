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
 * Grouped task definitions
 */
gulp.task('dev', [], () => {
    $.nodemon();
});

gulp.task('run', [], () => {

});

gulp.task("set:test", () => {
    process.env.NODE_ENV = 'test';
});

gulp.task("build:client", (done) => {
    var config = require("./webpack");
    webpack(config).run(onWebpackCompleted(done));
});

gulp.task('build:all', ['build:client', '']);

gulp.task('test', ['test:client', 'test:server']);

gulp.task('test:client', () => {

});

gulp.task('test:server', ['set:test'], () => {
    gulp.src(config.src.server.tests, { read: false })
        .pipe($.mocha(config.options.mocha))
        .on('end', () => {
            $.util.log($.util.colors.bgYellow('INFO:'), 'Mocha completed');
        })
        .on('error', (err) => {
            $.util.log($.util.colors.bgRed('ERROR:'), $.util.colors.red(err.message));
            $.util.log('Stack:', $.util.colors.red(err.stack));
        });
});

/**
 * coverage task
 * Run code coverage on server files
 */
gulp.task('test:coverage', ["set:test"], () => {
    var mochaError;
    gulp.src(['./server/**/*.js'])
        .pipe($.istanbul({ includeUntested: false }))
        .pipe($.istanbul.hookRequire())
        .on('finish', () => {
            gulp.src(config.src.server.tests)
                .pipe($.mocha())
                .on('error', (err) => {
                    $.util.log($.util.colors.bgRed('ERROR:'), $.util.colors.red(err.message));
                    $.util.log('Stack:', $.util.colors.red(err.stack));
                    mochaError = err;
                })
                .pipe($.istanbul.writeReports({
                    reporters: ['lcov']
                }))
                .on('end', () => {
                    if (mochaError) {
                        console.log('Mocha encountered an error, exiting with status 1');
                        console.log('Error:', mochaError.message);
                        process.exit(1);
                    }
                    process.exit();
                });
        });
});

gulp.task("watch-mocha", ["set:test", 'test:server'], () => {
    console.log(config.src.server.tests.concat(config.src.server.js));
    gulp.watch(config.src.server.tests.concat(config.src.server.js), ["test:server"]);
});

/**
 * Cleaning folders tasks 
 */
gulp.task('clean:coverage', () => {
    return del(config.dirs.coverage);
});
gulp.task('clean:build', () => {
    return del(config.dirs.build);
});
gulp.task('clean', ['clean:coverage', 'clean:build']);

gulp.task('default', ['dev']);

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