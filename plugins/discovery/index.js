'use strict';
/*jslint node: true */
let registry = require('etcd-registry'),
    errors = require('../../lib/errors'),
    debug = require('debug')('discovery')
    ;

var Plugin = function (params, pipeGlobal) {
    let services = registry(`http://${params.etcd_host}:${params.etcd_port}`);
    return function (req, res, next) {
        if (params.mapTo) {
            new Promise((resolve, reject) => {
                debug(`Try to discover service: ${params.mapTo}`);
                try {
                    services.lookup(params.mapTo, (err, service) => {
                        if (err) {
                            reject(new errors.err502(`Service ${params.mapTo} discovery error`))
                        } else {
                            if (!service) {
                                reject(new errors.err404(`Service ${params.mapTo} is not found`));
                            } else {
                                resolve(service);
                            }
                        }
                    });
                } catch (error) {
                    reject(error)
                }

            }).then(service => {
                Object.assign(pipeGlobal, {
                    target: service.url
                });
                debug(`Service ${params.mapTo} found on: ${service.url}`);
                return next();
            }).catch((err) => {
                return next(err);
            });
        } else {
            return next(new errors.err404('Service is not found'));
        }
    }
}
Plugin._name = "discovery";
Plugin._description = "bla-bla";
module.exports = Plugin
