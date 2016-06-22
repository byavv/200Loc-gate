'use strict';
/*jslint node: true */
const registry = require('etcd-registry'),
    GateWayError = require("../../lib/errors").err502,
    NotFoundError = require("../../lib/errors").err404,
    debug = require('debug')('discovery')
    ;

module.exports = (function () {
    let services = registry(`http://${process.env.ETCD_HOST || "192.168.99.100"}:4001`);
  
    var cls = function (params) {
        this.options = Object.assign({/* defaults */ }, params);       
    }
    cls.prototype = {       
        handler: function (req, res, next) {
            if (this.options.mapTo) {
                new Promise((resolve, reject) => {
                    console.log("try to find for", this.options.mapTo)
                    services.lookup(this.options.mapTo, (err, service) => {
                        if (err || !service) {
                            reject(err || new GateWayError(`Service ${this.options.mapTo} is not found or unevailable`));
                        } else {
                            resolve(service);
                        }
                    });
                }).then(service => {
                    req.pipeGlobal = Object.assign(req.pipeGlobal, {
                        target: service.url
                    });
                    debug(`Service ${this.options.mapTo} found on: ${service.url}`);
                    return next();
                }).catch((err) => {
                    return next(err);
                });
            } else {
                return next(new NotFoundError());
            }
        }
    };
    cls.pluginName = "discovery";
    cls.description = "bla-bla";
    return cls;
})();
