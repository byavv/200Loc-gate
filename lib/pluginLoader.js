/*jslint node: true */
'use strict';
const path = require("path"),
    fs = require("fs"),
    async = require('async')
    ;

module.exports = function () {
    return {
        loadPlugins: function (pluginsDirPath) {
            let plugins = [];
            return new Promise((resolve, reject) => {
                fs.readdir(pluginsDirPath, (err, files) => {
                    if (err) reject(err);
                    async.each(files, (file, callback) => {
                        console.log(file)
                        try {
                            let plugin = require(path.join(pluginsDirPath, file));
                            let configPath = path.join(pluginsDirPath, plugin._name, 'config.json')
                            fs.exists(configPath, (exists) => {
                                try {
                                    plugin.config = exists ? require(configPath) : {};
                                    plugins.push(plugin);
                                    callback();
                                } catch (error) {
                                    callback(error);
                                }
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
        }
    };
}

