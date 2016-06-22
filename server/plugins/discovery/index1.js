'use strict';
/*jslint node: true */
const registry = require('etcd-registry'),
    GateWayError = require("../../lib/errors").err502,
    NotFoundError = require("../../lib/errors").err404,
    debug = require('debug')('discovery')
    ;


module.exports = (app, options) => {
    const services = registry(`http://${app.get('etcd_host')}:4001`);
    var _options = { /* plugin defaults */ };

    return {
        name: 'discovery',
        description: "bla-bla",
        init: (params) => {
            _options = Object.assign(_options, params);
            console.log(_options)
        },
        handler: (req, res, next) => {
            if (_options.mapTo) {
                new Promise((resolve, reject) => {
                    console.log("try to find for", _options.mapTo)
                    services.lookup(_options.mapTo, (err, service) => {
                        if (err || !service) {
                            reject(err || new GateWayError(`Service ${_options.mapTo} is not found or unevailable`));
                        } else {
                            resolve(service);
                        }
                    });
                }).then(service => {
                    req.pipeGlobal = Object.assign(req.pipeGlobal, {
                        target: service.url
                    })
                    debug(`Service ${_options.mapTo} found on: ${service.url}`);
                    return next();
                }).catch((err) => {
                    return next(err);
                });
            } else {
                return next(new NotFoundError());
            }
        }
    }
}