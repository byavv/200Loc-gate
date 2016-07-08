'use strict';
var ErrorX = require("../../errorX");

var Plugin = function (params, pipeGlobal) {
    return function (req, res, next) { 
        pipeGlobal.dynamic = "harry potter"; 
        return next(null);
    }
}
Plugin._name = "setDynamicPlugin";
Plugin._description = "test plugin";
module.exports = Plugin;
