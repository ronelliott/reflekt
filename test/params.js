'use strict';

var should = require('should'),
    params = require('../reflekt').params;

describe('params', function() {
    it('should allow an array to be passed with resolution names and the function to be called', function() {
        params([ 'foo', 'bar', function(a, b) {}]).should.eql([ undefined, undefined ]);
    });

    it('should allow a function to be passed to be parsed for resolution values', function() {
        params(function(foo, bar) {}).should.eql([ undefined, undefined ]);
    });

    it('should allow an object to be passed for resolutions', function() {
        params(function(foo, bar) {}, { foo: 'foo', bar: 'bar' }).should.eql([ 'foo', 'bar' ]);
    });

    it('should allow a function to be passed for resolutions', function() {
        params(function(foo, bar) {}, function() { return 'foo'; }).should.eql([ 'foo', 'foo' ]);
    });

    it('should return an empty array if the given function has no parameters', function() {
        params(function() {}).should.eql([]);
    });

    it('should allow a string to be passed in place of a function', function() {
        params('foo', { foo: function(bar) {}, bar: 'bar' }).should.eql([ 'bar' ]);
    });
});
