/*jslint node: true */
"use strict";
const async = require("async"),
    NotAuthorizedError = require("../../../lib/errors").err401,
    NotFoundError = require("../../../lib/errors").err404,
    debug = require("debug")("proxy"),
    HttpProxyRules = require('http-proxy-rules'),
    uuid = require('node-uuid')
    ;

var superMiddlewareFactory = (options) => {
    var rules = options.rules;
    return (req, res, next) => {
        var plugins = [];
        var walk = (index) => {
            if (index < plugins.length) {
                plugins[index].handler(req, res, (err) => {
                    if (err) {
                        return next(err);
                    }
                    index++;
                    walk(index);
                });
            } else {
                next();
            }
        }
        let target = rules.match(req);
        if (target && target.methods.includes(req.method)) {
            plugins = target.plugins || [];
            walk(0);
        } else {
            next(new NotFoundError())
        }
    };
};

module.exports = (app, componentOptions) => {
    var ApiConfig = app.models.ApiConfig;

    app.middleware('initial', (req, res, next) => {
        req.pipeGlobal = { /* defaults for all plugins */ };
        next();
    });

    ApiConfig.find((err, apiConfigs) => {
        if (err) throw err;
        var proxyRules = {};
        (apiConfigs || []).forEach(config => {
            try {
                const routePlugins = app.plugins.filter(plugin => (config.plugins || []).includes(plugin.pluginName));
                proxyRules[config.entry] = {
                    plugins: routePlugins.map(P => new P(config.config || {})),
                    name: config.name,
                    methods: config.methods
                };
                debug(`Handle route: ${config.entry} \u2192`);
            } catch (error) {
                throw err;
            }
        });
        app.middleware('routes', superMiddlewareFactory({
            rules: new HttpProxyRules({
                rules: proxyRules,
                default: 'http://localhost:8080' // default target
            })
        }));
    })
};
