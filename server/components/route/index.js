/*jslint node: true */
"use strict";
const async = require("async"),
    NotAuthorizedError = require("../../lib/errors").err401,
    NotFoundError = require("../../lib/errors").err404,
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
    var GLOBAL_CONFIG_REGEXP = /\$\{(\w+)\}$/;   
    // app.middleware('initial', (req, res, next) => {
    //     req.pipeGlobal = { /* defaults for all plugins */ };
    //     next();
    // });

    ApiConfig.find((err, apiConfigs) => {
        if (err) throw err;
        var proxyRules = {};
        (apiConfigs || []).forEach(config => {
            try {
                const routePlugins = app.plugins.filter(plugin => (config.plugins || []).includes(plugin.name));
                var pipeGlobal = { /* defaults for all plugins */ };
                Object.keys(config.config).forEach((key)=>{
                    if(config.config[key].match(GLOBAL_CONFIG_REGEXP)){
                        config.config[key] = pipeGlobal[key];
                    }
                })
                proxyRules[config.entry] = {
                    plugins: routePlugins.map(P => new P(config.config || {}, pipeGlobal)),
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


function getConfigVariable(param) {
    var configVariable = param;
    var match = configVariable.match(DYNAMIC_CONFIG_PARAM);
    if (match) {
      var varName = match[1];
      if (useEnvVars && process.env[varName] !== undefined) {
        debug('Dynamic Configuration: Resolved via process.env: %s as %s',
          process.env[varName], param);
        configVariable = process.env[varName];
      } else if (app.get(varName) !== undefined) {
        debug('Dynamic Configuration: Resolved via app.get(): %s as %s',
          app.get(varName), param);
        var appValue = app.get(varName);
        configVariable = appValue;
      } else {
        // previously it returns the original string such as "${restApiRoot}"
        // it will now return `undefined`, for the use case of
        // dynamic datasources url:`undefined` to fallback to other parameters
        configVariable = undefined;
        console.warn('%s does not resolve to a valid value, returned as %s. ' +
        '"%s" must be resolvable in Environment variable or by app.get().',
          param, configVariable, varName);
        debug('Dynamic Configuration: Cannot resolve variable for `%s`, ' +
          'returned as %s', varName, configVariable);
      }
    }
    return configVariable;
  }