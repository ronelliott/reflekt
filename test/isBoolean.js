'use strict';

var should = require('should'),
    isBoolean = require('../reflekt').isBoolean;

describe('isBoolean', function() {
    it('should return false if the given item is an array', function() {
        isBoolean([]).should.equal(false);
    });

    it('should return true if the given item is a boolean', function() {
        isBoolean(true).should.equal(true);
    });

    it('should return false if the given item is a function', function() {
        isBoolean(function() {}).should.equal(false);
    });

    it('should return false if the given item is an object', function() {
        isBoolean({}).should.equal(false);
    });

    it('should return true if the given item is a string', function() {
        isBoolean('foo').should.equal(false);
    });
});
