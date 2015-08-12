'use strict';

var should = require('should'),
    reflekt = require('../reflekt');

describe('injections', function() {
    it('should allow an object to be passed for resolutions', function() {
        reflekt.injections(function test(foo, bar) {}, { foo: 'foo', bar: 'bar' }).should.eql([ 'foo', 'bar' ]);
    });

    it('should allow nothing to be passed for resolutions', function() {
        reflekt.injections(function test(foo, bar) {}).should.eql([ undefined, undefined ]);
    });

    it('should allow an array of resolvers to be passed for resolutions', function() {
        reflekt.injections(function test(foo, bar) {}, [ { bar: 'bar' }, { foo: 'foo' } ]).should.eql([ 'foo', 'bar' ]);
    });

    it('should use the first resolution for a parameter when given an array of resolvers', function() {
        reflekt.injections(function test(foo, bar) {}, [ { bar: 'bar' }, { foo: 'foo' }, { foo: 'far' } ]).should.eql([ 'foo', 'bar' ]);
    });
});
