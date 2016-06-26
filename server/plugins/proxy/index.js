/*jslint node: true */
"use strict";
const debug = require('debug')('proxy'),
    httpProxy = require('http-proxy'),
    HttpProxyRules = require('http-proxy-rules'),
    GateWayError = require("../../lib/errors").err502,
    NotFoundError = require("../../lib/errors").err404
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
            return next(new NotFoundError());
        }
    }
};
Plugin.pluginName = 'proxy';
Plugin.description = 'proxy';

module.exports = Plugin;
