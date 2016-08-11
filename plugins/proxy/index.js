/*jslint node: true */
"use strict";
const debug = require('debug')('proxy'),
    httpProxy = require('http-proxy'),
    errors = require('../../lib/errors')
    ;

var Plugin = function (params, pipeGlobal) {
    const proxy = httpProxy.createProxyServer({});
    return function (req, res, next) {
        if (params.target) {
            proxy.web(req, res, {
                target: params.target + (params.withPath || '/')
            }, (err) => {
                return next(err);
            });
            debug(`${req.method}: ${req.originalUrl} \u2192 ${params.target}${params.withPath}`);
        } else {
            return next(new errors.err502());
        }
    }
};

Plugin._name = 'proxy';
Plugin._description = 'proxy';

module.exports = Plugin;
