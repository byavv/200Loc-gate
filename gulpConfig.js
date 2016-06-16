/*jslint node: true */
'use strict';

var path = require('path');
var rootPath = path.normalize(__dirname);
var conf = {
    dirs: {
        server: 'server',
        client: 'client',
        build: 'build',
        coverage: process.env.CIRCLE_ARTIFACTS || 'coverage'
    },
    src: {
        server: {
            js: [
                'server/**/*.js',
                '!server/**/*.spec.js'
            ],
            tests: [
                'test/**/*.spec.js'
            ]
        }
    },
    options: {
        mocha: {
            reporter: 'spec'
        }
    }
};

module.exports = conf;