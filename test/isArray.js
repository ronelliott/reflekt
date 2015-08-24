'use strict';

var should = require('should'),
    isArray = require('../reflekt').isArray;

describe('isArray', function() {
    it('should return true if the given item is an array', function() {
        isArray([]).should.equal(true);
    });

    it('should return false if the given item is a boolean', function() {
        isArray(true).should.equal(false);
    });

    it('should return false if the given item is a function', function() {
        isArray(function() {}).should.equal(false);
    });

    it('should return false if the given item is an object', function() {
        isArray({}).should.equal(false);
    });

    it('should return false if the given item is a string', function() {
        isArray('foo').should.equal(false);
    });
});
