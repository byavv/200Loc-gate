/*jslint node: true */
"use strict";
const async = require("async"),
    NotAuthorizedError = require("../../lib/errors").err401,
    NotFoundError = require("../../lib/errors").err404,
    debug = require("debug")("proxy")
    ;

var superMiddlewareFactory = (options) => {
    var plugins = options.plugins || [];
    return (req, res, next) => {
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
        walk(0);
    };
};

var auth = module.exports = (app, componentOptions) => {
    var ApiConfig = app.models.ApiConfig;

    app.middleware('initial', (req, res, next) => {
        req.pipeGlobal = {/* defaults for all plugins */ };
        next();
    });

    ApiConfig.find((err, configs) => {
        configs.forEach(config => {
            try {
                //const pathPrefixRegexp = new RegExp(config.entry);
                // const pathPrefixRegexp = new RegExp('(' + config.entry + ')' + '(.+)');
                let pathPrefixRegexp;
                if (config.entry.endsWith('/')) {
                    pathPrefixRegexp = new RegExp(config.entry);
                } else {
                    pathPrefixRegexp = new RegExp('(' + config.entry + ')' + '(?:\\W|$)');
                }

                let routePlugins = app.plugins.filter(plugin => (config.plugins || []).includes(plugin.name))
                ///^(discussion|page)\/(.+)/
                debug(`Handle route: ${pathPrefixRegexp} \u2192`);

                app.middlewareFromConfig(superMiddlewareFactory, {
                    methods: (config.methods != '*') ? config.methods : null,
                    phase: 'routes',
                    paths: pathPrefixRegexp,
                    params: {
                        plugins: routePlugins.map(P => new P(config.config || {})),
                    }
                });
            } catch (error) {
                throw error;
            }

        })
    })
};
