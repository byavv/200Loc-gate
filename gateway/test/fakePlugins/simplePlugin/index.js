'use strict';
var ErrorX = require("../../errorX");

var Plugin = function (params, pipeGlobal) {
    return function (req, res, next) { 
        return params.dynamic
        ? res.status(200).send({respond: params.dynamic})
        : res.status(200).send({respond: params.env})
    }
}
Plugin._name = "simplePlugin";
Plugin._description = "test plugin";
module.exports = Plugin;
