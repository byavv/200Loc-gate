/*jslint node: true */
'use strict';
const path = require("path"),
    async = require('async')    
    ;

module.exports = function (app) {
    var router = app.loopback.Router();
    var ApiConfig = app.models.ApiConfig;

    router.get('/api/configs', (req, res) => {
        ApiConfig.find((err, configs) => {
            res.send(configs);
        });
    });

    router.get('/api/config/:id', (req, res) => {
        ApiConfig.findById(req.params.id, (err, config) => {
            res.send(config);
        });
    });

    router.post('/api/config/:id', (req, res) => {
        ApiConfig.findOrCreate({ where: { id: req.params.id } }, req.body, (err, config) => {
            if (err) return res.sendStatus(500);
            //  console.log(config.plugins)
            config.updateAttributes(req.body, (err, cf) => {
                if (err) return res.sendStatus(500);
                return res.status(200).send(cf);
            });
        });
    });

    router.get('/api/plugins', (req, res) => {        
        return res.send((req.app.plugins || []).map(plugin => {
            return {
                name: plugin._name,
                description: plugin._description,
                settings: plugin.config
            };
        }));      
    });

    router.delete('/api/config/:id', (req, res) => {
        ApiConfig.destroyById(req.params.id, (err, result) => {
            if (err) return res.sendStatus(500);
            return res.send(result);
        });
    })

    router.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../build/index.html'));
    });

    app.use(router)
};