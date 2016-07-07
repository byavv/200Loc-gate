/*jslint node: true */
"use strict";
const async = require("async"),
    NotAuthorizedError = require("../../../lib/errors").err401,
    NotFoundError = require("../../../lib/errors").err404,
    debug = require("debug")("proxy"),
    HttpProxyRules = require('http-proxy-rules'),
    uuid = require('node-uuid'),
    loader = require('./../../../lib/pluginLoader')()
    ;

var superMiddlewareFactory = (options) => {
    var rules = options.rules;
    return (req, res, next) => {
        var plugins = [];
        var walk = (index) => {
            if (index < plugins.length) {
                plugins[index](req, res, (err) => {
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

module.exports = function (app, componentOptions) {
    var ApiConfig = app.models.ApiConfig;
    var DYNAMIC_CONFIG_PARAM = /\$\{(\w+)\}$/;
    var ENV_CONFIG_PARAM = /\env\{(\w+)\}$/;
    var plugins = app.plugins;

    ApiConfig.find((err, apiConfigs) => {
        if (err) throw err;
        var proxyRules = {};
        (apiConfigs || []).forEach(apiConfig => {
            try {
                var pipeGlobal = { /* defaults for all plugins */ };
                var apiConfigPlugins = apiConfig.plugins || [];
                var pluginsArray = [];

                apiConfigPlugins.forEach((plugin) => {
                    var pluginName = plugin.name;
                    var settings = plugin.settings;
                    // find all dynamic parameters and provide getting values from global object
                    Object.keys(settings).forEach((paramKey) => {
                        var matchDyn = settings[paramKey].match(DYNAMIC_CONFIG_PARAM);
                        var matchEnv = settings[paramKey].match(ENV_CONFIG_PARAM);
                        if (matchDyn) {
                            Object.defineProperty(settings, paramKey, {
                                get: function () {                                    
                                    return pipeGlobal[matchDyn[1]]; /*apply function*/
                                },
                            })
                        }
                        if (matchEnv) {
                            Object.defineProperty(settings, paramKey, {
                                get: function () {                                   
                                    return process.env[matchEnv[1]];
                                },
                            })
                        }
                    });
                    var pluginBuilder = app.plugins.find((plugin) => plugin._name === pluginName);
                    if (!pluginBuilder) {
                        throw new Error(`Plugin ${pluginName} is not defined`);
                    } else {
                        let handler = pluginBuilder(settings || {}, pipeGlobal);
                        pluginsArray.push(handler);
                    }
                })


                proxyRules[apiConfig.entry] = {
                    plugins: pluginsArray,
                    name: apiConfig.name,
                    methods: apiConfig.methods
                };
                debug(`Handle route: ${apiConfig.entry} \u2192`);
            } catch (error) {
                throw error;
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
