/*jslint node: true */
'use strict';
const path = require("path"),
    async = require('async'),
    loader = require('../../lib/pluginLoader')()
    ;
module.exports = function (app) {
    var router = app.loopback.Router();
    var ApiConfig = app.models.ApiConfig;
    router.get('/api/plugins', (req, res) => {
        loader.loadPlugins().then((plugins) => {
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
            console.log(config)
            res.send(config);
        })
    });

    router.post('/api/create', (req, res) => {
        ApiConfig.create(req.body, (err, config) => {
            if (err) throw err;
            return res.send(config);
        })
    });

    router.get('/api/plugins/:name', (req, res) => {
        loader.loadPluginConfig(req.params.name).then((config) => {
            return res.send(config);
        }, (err) => {
            //todo
            return res.status(400).send(err);
        });
    });

    router.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../../build/index.html'));
    });
    app.use(router)
};