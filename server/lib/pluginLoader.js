/*jslint node: true */
'use strict';
const path = require("path"),
    fs = require("fs"),
    async = require('async')
    ;

module.exports = function () {
    const pluginsPath = path.resolve(__dirname, '../plugins');
    return {
        loadPlugins: function () {
            var plugins = [];
            return new Promise((resolve, reject) => {
                fs.readdir(pluginsPath, (err, files) => {
                    async.each(files, (file, callback) => {
                        try {
                            let plugin = require(path.join(pluginsPath, file));
                            fs.exists(path.join(pluginsPath, plugin._name, 'config.json'), (exists) => {
                                if (exists) {
                                    plugin.config = require(path.join(pluginsPath, plugin._name, 'config.json'));
                                } else {
                                    plugin.config = {}
                                }
                                plugins.push(plugin);
                                callback();
                            });

                        } catch (error) {
                            callback(error);
                        }
                    }, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(plugins);
                        };
                    });
                });
            });
        }//,
        /* loadPluginConfig: function (name) {
             var config = {};
             return new Promise((resolve, reject) => {
                 try {
                     fs.exists(path.join(pluginsPath, name, 'config.json'), (exists) => {
                         if (exists) {
                             config = require(path.join(pluginsPath, name, 'config.json'));
                             resolve(config)
                         } else {
                             reject(new Error("No config file defined"));
                         }
                     });
                 } catch (error) {
                     reject(error);
                 }
             });
         }*/
    };
}

