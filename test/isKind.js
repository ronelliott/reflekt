'use strict';

var should = require('should'),
    isKind = require('../reflekt').isKind;

describe('isKind', function() {
    it('should return true if the given item and value is an array', function() {
        isKind([], '[object Array]').should.equal(true);
    });

    it('should return false if the given item is an array and the value is a function', function() {
        isKind([], '[object Function]').should.equal(false);
    });

    it('should return false if the given item is an array and the value is an object', function() {
        isKind([], '[object Object]').should.equal(false);
    });

    it('should return false if the given item is an array and the value is a string', function() {
        isKind([], '[object String]').should.equal(false);
    });

    it('should return true if the given item and value is a function', function() {
        isKind(function() {}, '[object Function]').should.equal(true);
    });

    it('should return false if the given item is a function and the value is an array', function() {
        isKind(function() {}, '[object Array]').should.equal(false);
    });

    it('should return false if the given item is a function and the value is an object', function() {
        isKind(function() {}, '[object Object]').should.equal(false);
    });

    it('should return false if the given item is a function and the value is a string', function() {
        isKind(function() {}, '[object String]').should.equal(false);
    });

    it('should return true if the given item and value is an object', function() {
        isKind({}, '[object Object]').should.equal(true);
    });

    it('should return false if the given item is an object and the value is an array', function() {
        isKind({}, '[object Array]').should.equal(false);
    });

    it('should return false if the given item is an object and the value is a function', function() {
        isKind({}, '[object Function]').should.equal(false);
    });

    it('should return false if the given item is an object and the value is a string', function() {
        isKind({}, '[object String]').should.equal(false);
    });

    it('should return true if the given item and value is a string', function() {
        isKind('foo', '[object String]').should.equal(true);
    });

    it('should return false if the given item is an object and the value is an array', function() {
        isKind('foo', '[object Array]').should.equal(false);
    });

    it('should return false if the given item is an object and the value is a function', function() {
        isKind('foo', '[object Function]').should.equal(false);
    });

    it('should return false if the given item is an object and the value is an object', function() {
        isKind('foo', '[object Object]').should.equal(false);
    });
});
