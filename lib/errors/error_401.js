'use strict';

module.exports = function UnauthorizedAccessError(message) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = `HTTP 401: ${message}`;
    this.status = 401;
};

require('util').inherits(module.exports, Error);
