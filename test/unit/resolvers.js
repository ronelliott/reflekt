'use strict';

var should = require('should'),
    sinon = require('sinon'),
    resolvers = require('../../src/resolvers');

describe('Resolvers', function() {
    describe('ObjectResolver', function() {
        it('should resolve items found', function(done) {
            var resolve = new resolvers.ObjectResolver({ foo: 'bar' });
            resolve('foo').should.equal('bar');
            done();
        });

        it('should not resolve items not found', function(done) {
            var resolve = new resolvers.ObjectResolver({ foo: 'bar' });
            should(resolve('bar')).not.be.ok;
            done();
        });
    });
});
