'use strict';
const errors = require("../../../../lib/errors")

module.exports = function (name) {
    return function (req, res, next) {
        return next(new errors.err500(`[${name}] is not implemented`));
    }
}