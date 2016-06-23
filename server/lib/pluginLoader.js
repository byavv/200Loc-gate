/*jslint node: true */
'use strict';
const path = require("path"),
    fs = require("fs"),
    async = require('async')
    ;

module.exports = function () {
    const pluginsPath = path.resolve(__dirname, '../plugins');
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