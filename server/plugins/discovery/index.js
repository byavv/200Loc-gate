'use strict';
/*jslint node: true */
const registry = require('etcd-registry'),
    GateWayError = require("../../lib/errors").err502,
    NotFoundError = require("../../lib/errors").err404,
    debug = require('debug')('discovery')
    ;


var Plugin = function (params, pipeGlobal) {
 //   let services = registry(`http://${process.env.ETCD_HOST || "192.168.99.100"}:4001`);
  let services = registry(`http://${params.etcd_host || "192.168.99.100"}:4001`);
    return function (req, res, next) {
        if (params.mapTo) {
            new Promise((resolve, reject) => {
                debug(`Try to discover service: ${params.mapTo}`);
                services.lookup(params.mapTo, (err, service) => {
                    if (err || !service) {
                        reject(err || new GateWayError(`Service ${params.mapTo} is not found or unevailable`));
                    } else {
                        resolve(service);
                    }
                });
                //  resolve({ url: "http://localhost:3044" });
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
            return next(new NotFoundError());
        }
    }
}
Plugin._name = "discovery";
Plugin._description = "bla-bla";
module.exports = Plugin
