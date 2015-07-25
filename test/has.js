'use strict';

var should = require('should'),
    has = require('../reflekt').has;

describe('has', function() {
    function testFn(foo, bar) {}

    it('should return true if the function has the given arg in its signature', function() {
        has(testFn, 'foo').should.equal(true);
    });

    it('should return false if the function does not have the given arg in its signature', function() {
        has(testFn, 'asdf').should.equal(false);
    });

    it('should return true if the function has all of the given args in its signature', function() {
        has(testFn, [ 'foo', 'bar' ]).should.equal(true);
    });

    it('should return false if the function does not have all of the given args in its signature', function() {
        has(testFn, [ 'foo', 'bar', 'dar' ]).should.equal(false);
    });

    it('should return false if the function is null', function() {
        has(null, 'foo').should.equal(false);
    });

    it('should return false if the function is not defined', function() {
        has(undefined, 'foo').should.equal(false);
    });
});
