'use strict';

var should = require('should'),
    sinon = require('sinon'),
    api = require('../../src/api');

describe('Api', function() {
    describe('args', function() {
        it('should parse functions with comments correctly', function(done) {
            var fn = function(c/*a parameter*/, a, // More parameters
                             /* Interesting */ r) { };
            api.args(fn).should.eql([ 'c', 'a', 'r']);
            done();
        });
    });

    describe('call', function() {
        it('should call the function', function(done) {
            var resolve = sinon.spy(),
                spy = sinon.spy();
            api.call(spy, resolve);
            spy.called.should.be.ok;
            resolve.called.should.not.be.ok;
            done();
        });
    });

    describe('caller', function() {
        it('should return a call generator', function(done) {
            var resolve = sinon.spy(),
                spy = sinon.spy(),
                caller = api.caller(resolve);
            caller(spy);
            spy.called.should.be.ok;
            resolve.called.should.not.be.ok;
            done();
        });
    });

    describe('decorate', function() {
        it('should return a decorated function', function(done) {
            var resolve = sinon.spy(),
                spy = sinon.spy(),
                result = api.decorate(spy, resolve);
            spy.called.should.not.be.ok;
            result();
            spy.called.should.be.ok;
            done();
        });

        it('should work with angular style strict injections', function(done) {
            var resolve = sinon.spy(),
                spy = sinon.spy(),
                result = api.decorate([spy], resolve);
            spy.called.should.not.be.ok;
            result();
            spy.called.should.be.ok;
            done();
        });
    });
});
