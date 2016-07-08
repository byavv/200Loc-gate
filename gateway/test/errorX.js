module.exports = function (code) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee); 
    this.status = code;
}
