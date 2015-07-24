'use strict';

var should = require('should'),
    ObjectResolver = require('../reflekt').ObjectResolver;

describe('ObjectResolver', function() {
    beforeEach(function() {
        this.resolver = new ObjectResolver({ foo: 'bar' });
    });

    it('should resolve items found', function() {
        this.resolver('foo').should.equal('bar');
    });

    it('should not resolve items not found', function() {
        should(this.resolver('bar')).not.be.ok;
    });

    it('should store lifetimes values when adding an item', function() {
        this.resolver.add('foo', 'foo', 1);
        this.resolver.lifetimes.foo.should.equal(1);
    });

    it('should reduce lifetime values when resolving an item', function() {
        this.resolver.add('foo', 'foo', 2);
        this.resolver.lifetimes.foo.should.equal(2);
        this.resolver('foo');
        this.resolver.lifetimes.foo.should.equal(1);
    });

    it('should remove lifetime values and items when resolving an item and its lifetime has reached 0', function() {
        this.resolver.add('foo', 'foo', 1);
        this.resolver.lifetimes.foo.should.equal(1);
        this.resolver('foo').should.equal('foo');
        should(this.resolver.lifetimes.foo).not.be.ok;
        should(this.resolver.items.foo).not.be.ok;
    });

    it('should remove items', function() {
        this.resolver.add('foo', 'foo');
        should(this.resolver.items.foo).be.ok;
        this.resolver.remove('foo');
        should(this.resolver.items.foo).not.be.ok;
    });
});
