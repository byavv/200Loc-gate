/*jslint node: true, mocha:true*/
"use strict";
const express = require('express'),
    chai = require('chai'),
    sinon = require('sinon'),
    assert = chai.assert,
    expect = chai.expect,
    NotAuthorizedError = require("../../lib/errors").err401,
    GatewayError = require("../../lib/errors").err502,
    request = require('supertest')
    ;

chai.should();

describe('GATEWAY TESTS', function () {
    var app;

    before((done) => {
        require('./init-server')((a) => {
            app = a;
            done()
        })
    });
    after((done) => {
        app.close(done);
    })

    it('should load plugins', () => {
        expect(app.plugins.length).to.be.equal(3);
    });   

    it("should return 'not found' when wrong url", (done) => {
        request(app)
            .get('/no_route/like_this')
            .expect(404)
            .end(done);
    });

    it('should return error when plugin returns fail', (done) => {
        request(app)
            .get('/test')
            .expect(404)
            .end(done);
    });
    it('should pipe plugin req', (done) => {
        request(app)
            .get('/test2')
            .expect(500)
            .end(done);
    });

    it('should return default strongloop 404 when plugin passes request', (done) => {
        request(app)
            .get('/test3')
            .expect(404)
            .end(done);
    });
    it('should use dynamic parameters', (done) => {
        request(app)
            .get('/test4')
            .expect(200, {
                respond: 'harry potter'
            })
            .end(done);
    });

    it('should use environment variable', (done) => {
        process.env.SOME_HOST = 'tobi'
        request(app)
            .get('/test5')
            .expect(200, {
                respond: 'tobi'
            })
            .end(done);
    });

});