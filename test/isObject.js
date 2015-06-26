'use strict';

var should = require('should'),
    isObject = require('../reflekt').isObject;

describe('isObject', function() {
    it('should return false if the given item is an array', function() {
        isObject([]).should.equal(false);
    });

    it('should return false if the given item is a function', function() {
        isObject(function() {}).should.equal(false);
    });

    it('should return true if the given item is an object', function() {
        isObject({}).should.equal(true);
    });

    it('should return false if the given item is a string', function() {
        isObject('foo').should.equal(false);
    });
});
