'use strict';
var ErrorX = require("../../errorX");

var Plugin = function (params, pipeGlobal) {
    return function (req, res, next) {        
        return next(params.throwError ? new ErrorX(params.errorCode || 404) : null);
    }
}
Plugin._name = "errPlugin";
Plugin._description = "test plugin";
module.exports = Plugin;
