/*jslint node: true */
'use strict';
var boot = require('loopback-boot'),
    http = require('http'),
    loopback = require('loopback'),
    path = require('path'),
    debug = require('debug')('proxy'),
    path = require("path"),
    fs = require("fs"),
    async = require('async'),
    bodyParser = require('body-parser'),
    loader = require('./lib/pluginLoader')()
    ;

const gatewayApp = loopback();
const explorerApp = loopback();

const http_port = process.env.HTTP_PORT || 3001,
    client_http_port = process.env.HTTP_PORT || 5601,
    mongo_host = process.env.DBSOURCE_HOST || '127.0.0.1';

gatewayApp.set("mongo_host", mongo_host);
gatewayApp.set('port', http_port);
gatewayApp.set('x-powered-by', false);

explorerApp.set("mongo_host", mongo_host);

loader.loadPlugins().then((plugins) => {
    gatewayApp.plugins = plugins;
    boot(gatewayApp, {
        appRootDir: path.join(__dirname, 'gatewayApp')
    }, (err) => {
        if (err) throw err;
        gatewayApp.start = () => {
            const httpServer = http.createServer(gatewayApp).listen(http_port, () => {
                gatewayApp.emit('started');
                gatewayApp.close = (cb) => {
                    gatewayApp.removeAllListeners('started');
                    gatewayApp.removeAllListeners('loaded');
                    httpServer.close(cb);
                };
                console.log(`Proxy server started on port ${http_port}`);
            });
        };
        if (require.main === module) {
            gatewayApp.start();
        }
        gatewayApp.loaded = true;
        gatewayApp.emit('loaded');
    });
}).then(() => {
    explorerApp.use('/static', loopback.static(path.join(__dirname, '../build')));
    boot(explorerApp, {
        appRootDir: path.join(__dirname, 'explorerApp')
    }, (err) => {
        if (err) throw err;
        explorerApp.start = () => {
            const httpServer = http.createServer(explorerApp).listen(client_http_port, () => {
                explorerApp.emit('started');
                explorerApp.close = (cb) => {
                    explorerApp.removeAllListeners('started');
                    explorerApp.removeAllListeners('loaded');
                    httpServer.close(cb);
                };
                console.log(`Client started on port ${client_http_port}`);
            });
        };
        if (require.main === module) {
            explorerApp.start();
        }
        explorerApp.loaded = true;
        explorerApp.emit('loaded');
    });
}).catch(err => {
    console.log(err);
})
