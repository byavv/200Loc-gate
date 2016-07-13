/*jslint node: true */
'use strict';

var path = require('path');
var rootPath = path.normalize(__dirname);
var conf = {
    dirs: {
        client: 'client',
        build: 'explorer/build',
        coverage: process.env.CIRCLE_ARTIFACTS || 'coverage'
    },
    src: {
        gateway: {
            server: {
                js: [
                    'gateway/server/**/*.js',
                    '!gateway/server/**/*.spec.js'
                ],
                tests: [
                    'gateway/test/**/*.spec.js'
                ]
            }
        },
        explorer: {
            server: {
                js: [
                    'explorer/server/**/*.js',
                    '!explorer/server/**/*.spec.js'
                ],
                tests: [
                    'explorer/test/**/*.spec.js',
                ]
            },
            client: {
                ts: [

                ],
                tests: [

                ]
            }
        },
        plugins: {
            js: [
                'plugins/**/*.js',
                '!plugins/**/*.spec.js',
            ],
            tests: [
                'plugins/**/*.spec.js',
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