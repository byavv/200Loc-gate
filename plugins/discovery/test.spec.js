/*jslint node: true, mocha:true*/
"use strict";
const loopback = require('loopback'),
    http = require("http"),
    chai = require('chai'),
    sinon = require('sinon'),
    expect = chai.expect,
    request = require('supertest'),
    //  plugin = require('./'),
    rewire = require('rewire')
    ;

describe('DISCOVERY PLUGIN TESTS', function () {

    var httpServer;
    describe('Discovery all ok', () => {
        const app = loopback();
        var global = {}
        const params = { mapTo: 'test', etcd_host: 'localhost', etcd_port: '4001' };
        let plugin = rewire("./");
        plugin.__set__("registry", () => {
            return {
                lookup: function (param, clb) {
                    expect(param).to.equal('test');
                    clb(null, { url: 'localhost' })
                }
            }
        });
        before((done) => {
            var pluginHandler = plugin(params, global);
            app.use(pluginHandler);
            app.get('/api', function (req, res) {
                res.status(200).json({ all: 'green' });
            });
            httpServer = http
                .createServer(app)
                .listen(3232, done);
        })

        after(function () {
            httpServer.close();
        });

        it('should throw 404 if mapTo isnt set', (done) => {
            params.mapTo = undefined;
            request(app)
                .get('/api')
                .expect(404)
                .end(done);
        });

        it('should set localhost to global variable', (done) => {
            params.mapTo = 'test';
            request(app)
                .get('/api')
                .expect(200)
                .end((err, res) => {
                    expect(global.target).to.equal('localhost');
                    done(err)
                });
        });

    });

    describe('Discovery broken', () => {

        const app = loopback();
        var global = {}
        const params = { mapTo: 'test', etcd_host: 'localhost', etcd_port: '4001' };
        let plugin = rewire("./");
        plugin.__set__("registry", () => {
            return {
                lookup: function (param, clb) {
                    expect(param).to.equal('test');
                    clb(null, null)
                }
            }
        });
        before((done) => {
            var pluginHandler = plugin(params, global);
            app.use(pluginHandler);
            app.get('/api', function (req, res) {
                res.status(200).json({ all: 'green' });
            });
            httpServer = http
                .createServer(app)
                .listen(3232, done);
        });

        after(function () {
            httpServer.close();
        });

        it('should throw when service is not found', (done) => {
            request(app)
                .get('/api')
                .expect(404)
                .end(done);
        });
    });
    describe('Discovery error', () => {

        const app = loopback();
        var global = {}
        const params = { mapTo: 'test', etcd_host: 'localhost', etcd_port: '4001' };
        let plugin = rewire("./");
        plugin.__set__("registry", () => {
            return {
                lookup: function (param, clb) {
                    expect(param).to.equal('test');
                    clb(new Error('Some vary bad error'), null)
                }
            }
        });
        before((done) => {
            var pluginHandler = plugin(params, global);
            app.use(pluginHandler);
            app.get('/api', function (req, res) {
                res.status(200).json({ all: 'green' });
            });
            httpServer = http
                .createServer(app)
                .listen(3232, done);
        });
        after(function () {
            httpServer.close();
        });

        it('should throw when service discovery error', (done) => {
            request(app)
                .get('/api')
                .expect(502)
                .end(done);
        });
    })
});
