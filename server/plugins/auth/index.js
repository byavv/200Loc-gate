'use strict';
/*jslint node: true */
var debug = require('debug')('proxy');


module.exports = (function () {

    var cls = function (params) {
        this.options = Object.assign({/* defaults */ }, params);
    }
    cls.prototype = {
        handler: function (req, res, next) {
            if (this.options.grant === '*') {
                return next(null);
            } else {
                if (!!req.accessToken && Array.isArray(this.options.grant)) {
                    let Role = req.app.models.role;
                    let ACL = req.app.models.ACL;
                    Role.find({
                        where: { can: { inq: this.options.grant } },
                        fields: { 'name': true, 'id': false }
                    }, (err, roles) => {
                        if (err) throw err;
                        if (!roles || roles.length === 0) {
                            return res.status(401).send("Permission can't be granted");
                        }
                        async.some(roles, (role, callback) => {
                            Role.isInRole(role.name, {
                                principalType: ACL.USER,
                                principalId: req.accessToken.userId
                            }, callback);
                        }, (err, result) => {
                            if (err) throw err;
                            // user is not in any appropriate role, which contains required permisison
                            return !result ? res.status(401).send("User authorized, but doesn't have required permission. Verify that sufficient grant have been granted") : next();
                        });
                    });
                } else {
                    let url = URL.parse(req.url);
                    debug(`Authorization failed for ${req.method} request on ${url.path}`);
                    return res.status(401).send(`Not authorized`);
                }
            }
        }
    };
    cls.pluginName = "authentication";
    cls.description = "bla-bla";
    return cls;
})();
