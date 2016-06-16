/*jslint node: true */
'use strict';
var boot = require('loopback-boot'),
    http = require('http'),
    loopback = require('loopback'),
    path = require('path'),
    YAML = require('yamljs'),
    debug = require('debug')('proxy')
    ;

const app = module.exports = loopback();
const appClient = loopback();
const http_port = process.env.HTTP_PORT || 3001,
    client_http_port = process.env.HTTP_PORT || 5601,
    etcd_host = process.env.ETCD_HOST || "192.168.99.100",
    mongo_host = process.env.DBSOURCE_HOST || '127.0.0.1',
    config = configure();

app.set("mongo_host", mongo_host);
app.set("etcd_host", etcd_host);
app.set('port', http_port);
app.set('access', config.access || []);
app.set('proxyTable', config.proxy || []);
app.set('rate', config.rate || []);
app.set('x-powered-by', false);

boot(app, __dirname, (err) => {
    if (err) throw err;
    app.start = () => {
        const httpServer = http.createServer(app).listen(http_port, () => {
            app.emit('started');
            app.close = function (cb) {
                app.removeAllListeners('started');
                app.removeAllListeners('loaded');
                httpServer.close(cb);
            };
            console.log(`Proxy server started on port ${http_port}`);
        });
    };
    if (require.main === module)
        app.start();
    app.loaded = true;
    app.emit('loaded');
});

appClient.use('/static', loopback.static(path.join(__dirname, '../build')));
appClient.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});
appClient.listen(client_http_port, () => {
    console.log(`Client started on port ${client_http_port}`);
});

function configure() {
    const filename = process.env.NODE_ENV ? `gateway.config.${process.env.NODE_ENV}.yml` : `gateway.config.development.yml`;
    try {
        return YAML.load(path.join(__dirname, '../', filename));
    } catch (err) {
        throw err;
    }
}