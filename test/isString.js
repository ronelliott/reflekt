'use strict';

var should = require('should'),
    isString = require('../reflekt').isString;

describe('isString', function() {
    it('should return false if the given item is an array', function() {
        isString([]).should.equal(false);
    })

    it('should return false if the given item is a boolean', function() {
        isString(true).should.equal(false);
    });

    it('should return false if the given item is a function', function() {
        isString(function() {}).should.equal(false);
    });

    it('should return false if the given item is an object', function() {
        isString({}).should.equal(false);
    });

    it('should return true if the given item is a string', function() {
        isString('foo').should.equal(true);
    });
});
