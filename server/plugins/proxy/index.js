/*jslint node: true */
"use strict";
const debug = require('debug')('proxy'),
    httpProxy = require('http-proxy'),
    HttpProxyRules = require('http-proxy-rules'),
    GateWayError = require("../../lib/errors").err502,
    NotFoundError = require("../../lib/errors").err404
    ;

module.exports = (function () {
    const proxy = httpProxy.createProxyServer({});

    var cls = function (params) {
        this.options = Object.assign({/* defaults */ }, params);
    }

    cls.prototype = {
        handler: function (req, res, next) {
            if (req.pipeGlobal && req.pipeGlobal.target) {
                proxy.web(req, res, {
                    target: req.pipeGlobal.target + (this.options.withPath || '/')
                }, (err) => {
                    return next(err);
                });
                debug(`${req.method}: ${req.originalUrl} \u2192 ${req.pipeGlobal.target}${this.options.withPath}`);
            } else {
                return next(new NotFoundError());
            }
        }
    };

    cls.pluginName = 'proxy';
    cls.description = 'proxy';
    return cls;
})();
