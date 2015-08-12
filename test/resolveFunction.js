'use strict';

var should = require('should'),
    resolveFunction = require('../reflekt').resolveFunction;

describe('resolveFunction', function() {
    it('should resolve a function from an array of resolvers', function() {
        function foo() {}
        resolveFunction('foo', [ { bar: 'bar' }, { foo: foo } ]).should.equal(foo);
    });

    it('should resolve a function from a function resolver', function() {
        function foo() {}
        resolveFunction('foo', function() { return foo; }).should.equal(foo);
    });

    it('should resolve a function from an object resolver', function() {
        function foo() {}
        resolveFunction('foo', { foo: foo }).should.equal(foo);
    });
});
