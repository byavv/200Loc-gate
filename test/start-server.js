var app = require('../server/gatewayApp/server');
var fakeData = require('./fakeEntries');
module.exports = function (done) {
  if (app.loaded) {
    app.once('started', () => {
      fakeData(app, done);
    });
    app.start();
  } else {
    app.once('loaded', function () {
      app.once('started', () => {
        fakeData(app, done);
      });
      app.start();
    });
  }
};