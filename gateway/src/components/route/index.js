/*jslint node: true */
"use strict";
const async = require("async"),   
    debug = require("debug")("proxy"),
    uuid = require('node-uuid'),   
    _ = require('lodash')
    ;

var superMiddlewareFactory = (options = {}) => {
    return (req, res, next) => {
        debug(`Got route: ${req.originalUrl}, matched entry: ${options.routeName}`);
        const handlers = (options.plugins || []).map(plugin => {
            return plugin.bind(null, req, res);
        });
        async.series(handlers, (err) => {
            if (err) {                
                debug(`Error processing ${req.originalUrl}, ${err}`);
                return next(err);
            }
            next();
        });
    };
};

module.exports = function (app, componentOptions = {}) {
    var ApiConfig = app.models.ApiConfig;
    var DYNAMIC_CONFIG_PARAM = /\$\{(\w+)\}$/;
    var ENV_CONFIG_PARAM = /\env\{(\w+)\}$/;
    var plugins = app.plugins;

    ApiConfig.find((err, apiConfigs) => {
        if (err) throw err;
        (apiConfigs || []).forEach(apiConfig => {
            try {
                const pipeGlobal = { /* defaults for all plugins */ };
                const pluginsArray = [];
                (apiConfig.plugins || []).forEach((plugin) => {
                    const settings = plugin.settings || {};
                    // find all dynamic parameters and provide getting values from global object or environment
                    Object.keys(settings).forEach((paramKey) => {
                        var matchDyn = settings[paramKey] && _.isString(settings[paramKey])
                            ? settings[paramKey].match(DYNAMIC_CONFIG_PARAM)
                            : false;
                        var matchEnv = settings[paramKey] && _.isString(settings[paramKey])
                            ? settings[paramKey].match(ENV_CONFIG_PARAM)
                            : false;
                        if (matchDyn) {
                            Object.defineProperty(settings, paramKey, {
                                get: function () {
                                    return pipeGlobal[matchDyn[1]]; /*apply function*/
                                },
                            });
                        }
                        if (matchEnv) {
                            Object.defineProperty(settings, paramKey, {
                                get: function () {
                                    return process.env[matchEnv[1]];
                                },
                            });
                        }
                    });
                    const pluginFactory = app.plugins.find((p) => p._name === plugin.name);
                    if (!pluginFactory) {                       
                        pluginsArray.push(require('./defaultPlugin')(plugin.name));
                    } else {
                        pluginsArray.push(pluginFactory(settings || {}, pipeGlobal));
                    }
                });

                app.middlewareFromConfig(superMiddlewareFactory, {
                    enabled: true,
                    phase: 'routes',
                    methods: apiConfig.methods,
                    paths: [apiConfig.entry],
                    params: {
                        plugins: pluginsArray,
                        routeName: apiConfig.name
                    }
                });

                debug(`Handle route: ${apiConfig.entry} \u2192`);
            } catch (error) {
                throw error;
            }
        });
    })
};
