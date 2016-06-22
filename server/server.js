/*jslint node: true */
'use strict';
var boot = require('loopback-boot'),
    http = require('http'),
    loopback = require('loopback'),
    path = require('path'),  
    debug = require('debug')('proxy'),
    path = require("path"),
    fs = require("fs"),
    async = require('async')
    ;

const app = module.exports = loopback();
const appClient = loopback();
const http_port = process.env.HTTP_PORT || 3001,
    client_http_port = process.env.HTTP_PORT || 5601,
  //  etcd_host = process.env.ETCD_HOST || "192.168.99.100",
    mongo_host = process.env.DBSOURCE_HOST || '127.0.0.1';

app.set("mongo_host", mongo_host);
//app.set("etcd_host", etcd_host);
app.set('port', http_port);
app.set('x-powered-by', false);

function loadPlugins(app) {
    const pluginsPath = path.resolve(__dirname, './plugins');
    var plugins = [];
    return new Promise((resolve, reject) => {
        fs.readdir(pluginsPath, (err, files) => {
            async.each(files, (file, callback) => {
                try {                   
                    let plugin = require(path.join(pluginsPath, file));
                    plugins.push(plugin);
                    callback();
                } catch (error) {
                    callback(error);
                }
            }, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(plugins);
                }
            })
        });
    })
}

loadPlugins(app).then((plugins) => {
    app.plugins = plugins;    
    boot(app, __dirname, (err) => {        
        if (err) throw err;
        app.start = () => {
            const httpServer = http.createServer(app).listen(http_port, () => {
                app.emit('started');
                app.close = (cb) => {
                    app.removeAllListeners('started');
                    app.removeAllListeners('loaded');
                    httpServer.close(cb);
                };
                console.log(`Proxy server started on port ${http_port}`);
            });
        };
        if (require.main === module) {
            app.start();
        }
        app.loaded = true;
        app.emit('loaded');
    });
})


appClient.use('/static', loopback.static(path.join(__dirname, '../build')));
appClient.get('/api', (req, res) => {

});
appClient.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});
appClient.listen(client_http_port, () => {
    console.log(`Client started on port ${client_http_port}`);
});
