'use strict';

module.exports = function GateWayError(message) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = `HTTP 502: ${message}`;
    this.status = 502;
};

require('util').inherits(module.exports, Error);
