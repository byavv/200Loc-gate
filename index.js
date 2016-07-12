/*jslint node: true */
'use strict';
var http = require('http'),
    path = require('path'),
    debug = require('debug')('proxy'),
    path = require("path"),
    loader = require('./lib/pluginLoader')()
    ;

const http_port_gate = process.env.GATE_HTTP_PORT || 3001,
    http_port_exp = process.env.EXPLORER_HTTP_PORT || 5601;

loader
    .loadPlugins(path.resolve(__dirname, './plugins'))
    .then((plugins) => {
        const gateway = require('./gateway');
        const explorer = require('./explorer');
        explorer.init(plugins).then(app => {
            app.start(http_port_exp);
        })
        gateway.init(plugins).then(app => {
            app.start(http_port_gate);
        })
    }).catch(err => {
        throw err;
    });
