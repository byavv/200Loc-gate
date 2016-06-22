/*jslint node: true */
"use strict";
const debug = require('debug')('proxy'),
    httpProxy = require('http-proxy'),
    HttpProxyRules = require('http-proxy-rules'),
    GateWayError = require("../../lib/errors").err502,
    NotFoundError = require("../../lib/errors").err404
    ;

module.exports = (app) => {
    const proxy = httpProxy.createProxyServer({});
    /**
     * For principle propogation's purposes, adds X-PRINCIPLE header to be consumed 
     * by services within perimeter. May be handy, when your target runs outside of 
     * loopback's authentication system. 
     */
    proxy.on('proxyReq', (proxyReq, req, res, options) => {
        if (req.accessToken && req.accessToken.userId) {
            proxyReq.setHeader('X-PRINCIPLE', req.accessToken.userId);
        }
    });
    var _options = { /*default */ };

    return {
        name: 'proxy',
        description: "bla-bla",
        init: function (params) {
            _options = Object.assign(_options, params)
        },
        handler: (req, res, next) => {           
            if (req.pipeGlobal && req.pipeGlobal.target) {
                proxy.web(req, res, {
                    target: req.pipeGlobal.target + (_options.withPath || '/')
                }, (err) => {
                    return next(err);
                });
                debug(`${req.method}: ${req.originalUrl} \u2192 ${req.pipeGlobal.target}${_options.withPath}`);
            } else {
                return next(new NotFoundError());
            }
        }
    }
}