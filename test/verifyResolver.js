'use strict';

var should = require('should'),
    reflekt = require('../reflekt'),
    ObjectResolver = reflekt.ObjectResolver,
    verifyResolver = reflekt.verifyResolver;

describe('verifyResolver', function() {
    it('should create an ObjectResolver if an object is passed', function() {
        verifyResolver({}).should.be.a.Function();
    });

    it('should return the function passed if a function is passed', function() {
        function fn() {}
        verifyResolver(fn).should.equal(fn);
    });

    it('should properly translate arrays of resolvers', function() {
        function fn(name) { return name }
        verifyResolver([ fn, { foo: 'foo' } ])
            .forEach(function(resolver) {
                resolver.should.be.a.Function();
                resolver('foo').should.equal('foo');
            });
    });
});
