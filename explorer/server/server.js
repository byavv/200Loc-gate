"use strtict"
const boot = require('loopback-boot')
    , http = require('http')
    , path = require('path')
    , loopback = require('loopback');

const app = loopback();
const mongo_host = process.env.DBSOURCE_HOST || '127.0.0.1';

app.set("mongo_host", mongo_host);

app.use('/static', loopback.static(path.join(__dirname, '../build')));

app.start = (port) => {
    const httpServer = http
        .createServer(app)
        .listen(port, () => {
            app.emit('started');
            app.close = (cb) => {
                app.removeAllListeners('started');
                app.removeAllListeners('loaded');
                httpServer.close(cb);
            };
            console.log(`Api explorer started on port ${port}`);
        });
    return httpServer;
};

module.exports = {
    init: function init(plugins) {
        app.plugins = plugins;
        return new Promise((resolve, reject) => {
            boot(app, __dirname, (err) => {
                if (err) reject(err)
                if (require.main === module) {
                    app.start();
                }
                resolve(app);
            });
        });
    }
}

