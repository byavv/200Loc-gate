/*jslint node: true */
'use strict';
const path = require("path"),
    async = require('async'),
    loadPlugins = require('../../lib/pluginLoader')
    ;
module.exports = function (app) {
    var router = app.loopback.Router();
    var ApiConfig = app.models.ApiConfig;
    router.get('/api/plugins', (req, res) => {
        loadPlugins().then((plugins) => {
            return res.send(plugins.map(plugin => {
                return {
                    name: plugin.pluginName,
                    description: plugin.description
                }
            }));
        });
    });

    router.get('/api/configs', (req, res) => {
        ApiConfig.find((err, configs) => {
            res.send(configs);
        })
    });

    router.get('/api/config/:id', (req, res) => {
        ApiConfig.findById(req.params.id, (err, config) => {
            res.send(config);
        })
    });

    router.post('/api/create', (req, res) => {
        ApiConfig.create(req.body, (err, config) => {
            if (err) throw err;
            return res.send(config);
        })
    });
    router.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../../build/index.html'));
    });
    app.use(router)
};