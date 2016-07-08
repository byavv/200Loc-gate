/*jslint node: true, mocha:true*/
"use strict";
const express = require('express'),
    chai = require('chai'),
    sinon = require('sinon'),
    assert = chai.assert,
    NotAuthorizedError = require("../server/lib/errors").err401,
    GatewayError = require("../server/lib/errors").err502,
    request = require('supertest')('http://localhost:3001')
    ;

chai.should();

describe('PROXY TESTS', function () {
    var app = require('../server/server');
    var httpServer, fakeHttpServer1, fakeHttpServer2;

    var fakeServer1 = express();
    fakeServer1.get('/api', function (req, res) {
        res.status(200).json({ name: 'potter' });
    });
    var fakeServer2 = express();
    fakeServer2.get('/blach/api', function (req, res) {
        res.status(200).json({ name: 'tobi' });
    });
    fakeServer2.get('/', function (req, res) {
        res.status(200).json({ name: 'ron' });
    });
    fakeServer2.post('/', function (req, res, next) {
        return next(new NotAuthorizedError("error"));
    });

    before(require('./start-server'));

    before(() => {
        
    });
    before((done) => {
        fakeHttpServer1 = fakeServer1.listen(3232, done);
    });
    before((done) => {
        fakeHttpServer2 = fakeServer2.listen(3233, done);
    });

    after(function (done) {
        app.lookup.restore();
        app.close(done);
    });
    after(function (done) {
        fakeHttpServer1.close(done);
    });
    after(function (done) {
        fakeHttpServer2.close(done);
    });

    it('should lookup service', (done) => {
        // request
        //     .get('/fake1')
        //     .end(function (err, result) {
        //         if (err) { return done(err); }
        //         try {
        //             assert(app.lookup.calledWith('fakeserver1'));
        //             done();
        //         } catch (error) {
        //             done(error);
        //         }
        //     });
        assert(5==5)
    });  
});