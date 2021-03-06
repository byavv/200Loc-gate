/*jslint node: true, mocha:true*/
"use strict";
const loopback = require('loopback'),
    http = require("http"),
    chai = require('chai'),
    sinon = require('sinon'),
    expect = chai.expect,
    request = require('supertest'),
    plugin = require('./')
    ;

describe('PROXY PLUGIN TESTS', function () {
    var app = loopback();
    var fakeServer = loopback();
    var global = {}
    var params = { target: 'http://localhost:3234', withPath: '/' }
    var pluginHandler = plugin(params, global);
    app.use(pluginHandler)
    var httpServer;
    before((done) => {
        httpServer = http
            .createServer(app)
            .listen(3232, done);
    })
    before((done) => {
        fakeServer.get('/api', function (req, res) {
            res.status(200).json({ name: 'potter' });
        });
        fakeServer.get('/fake2', function (req, res) {
            res.status(200).json({ name: 'tobi' });
        });
        fakeServer.get('/error', function (req, res) {
            res.sendStatus(500);
        });
        fakeServer.use((req, res, next) => {
            next()
        })
        fakeServer = fakeServer.listen(3234, done);
    })

    after(function () {
        fakeServer.close();
        httpServer.close();
    });

    it('should return 404 if route not found', (done) => {
        request(app)
            .get('/fake1')
            .expect(404)
            .end(done);
    });

    it('should return 200 if route found', (done) => {
        request(app)
            .get('/api')
            .expect(200)
            .end(done);
    });

    it('should return 500 like target', (done) => {
        request(app)
            .get('/error')
            .expect(500)
            .end(done);
    });

    it('should throw if target does not set', (done) => {
        params.target = undefined;
        request(app)
            .get('/fake2')
            .expect(502)
            .end(done);
    });
});
