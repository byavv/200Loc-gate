'use strict';

var Plugin = function (params, pipeGlobal) {
    return function (req, res, next) {
        return res.status(200).send({respond: 'ok'});
    }
}
Plugin._name = "notReturnAnythingPlugin";
Plugin._description = "description";
module.exports = Plugin;