'use strict';

module.exports = function InternalServerError(message) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = `HTTP 500: ${message}`;
    this.status = 500;
};

require('util').inherits(module.exports, Error);
