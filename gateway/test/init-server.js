var fakeData = require('./fakeEntries');
var loader = require('../../lib/pluginLoader')();
var path = require('path');

module.exports = function (done) {
  loader
    .loadPlugins(path.resolve(__dirname, './fakePlugins'))
    .then((plugins) => {
      const gateway = require('../server/server');
      gateway.init(plugins).then(app => {
        fakeData(app, () => {
          app.start(3009);
        })
        app.once('started', () => {
          done(app)
        });
      })
    }).catch(err => {
      done(err)
    });
};
