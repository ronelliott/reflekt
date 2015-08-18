'use strict';

var should = require('should'),
    ObjectResolver = require('../reflekt').ObjectResolver;

describe('ObjectResolver', function() {
    beforeEach(function() {
        this.resolver = new ObjectResolver({ foo: 'bar' });
    });

    it('should accept no parameters', function() {
        (function() {
            new ObjectResolver().add('foo', 'foo');
        }).should.not.throw();
    });

    it('should resolve items found', function() {
        this.resolver('foo').should.equal('bar');
    });

    it('should resolve items found using get', function() {
        this.resolver.get('foo').should.equal('bar');
    });

    it('should not resolve items not found', function() {
        should(this.resolver('bar')).not.be.ok;
    });

    it('should not resolve items not found using get', function() {
        should(this.resolver.get('bar')).not.be.ok;
    });

    it('should add items', function() {
        should(this.resolver('bar')).not.be.ok;
        this.resolver.add('bar', 'bar');
        should(this.resolver('bar')).be.equal('bar');
    });

    it('should add items using set', function() {
        should(this.resolver('bar')).not.be.ok;
        this.resolver.set('bar', 'bar');
        should(this.resolver('bar')).be.equal('bar');
    });

    it('should properly check if it has items', function() {
        this.resolver.has('bar').should.equal(false);
        this.resolver.add('bar', 'bar');
        this.resolver.has('bar').should.equal(true);
    });

    it('should remove items', function() {
        this.resolver.add('foo', 'foo');
        should(this.resolver.items.foo).be.ok;
        this.resolver.remove('foo');
        should(this.resolver.items.foo).not.be.ok;
    });

    it('should add all items in an object', function() {
        var that = this;

        check([
            'bar',
            'dar',
            'zar'
        ], false);

        this.resolver.add({
            bar: true,
            dar: true,
            zar: true
        });

        check([
            'bar',
            'dar',
            'zar'
        ], true);

        function check(values, shouldExist) {
            values.forEach(function(name) {
                if (shouldExist) {
                    should(that.resolver(name)).equal(true);
                } else {
                    should(that.resolver(name)).equal(undefined);
                }
            });
        }
    });

    it('should add all items in an object using get', function() {
        var that = this;

        check([
            'bar',
            'dar',
            'zar'
        ], false);

        this.resolver.add({
            bar: true,
            dar: true,
            zar: true
        });

        check([
            'bar',
            'dar',
            'zar'
        ], true);

        function check(values, shouldExist) {
            values.forEach(function(name) {
                if (shouldExist) {
                    should(that.resolver.get(name)).equal(true);
                } else {
                    should(that.resolver.get(name)).equal(undefined);
                }
            });
        }
    });

    it('should remove all items in an array', function() {
        var that = this;

        this.resolver.add({
            bar: true,
            dar: true,
            zar: true
        });

        check([
            'bar',
            'dar',
            'zar'
        ], true);

        this.resolver.remove([
            'bar',
            'dar',
            'zar'
        ]);

        check([
            'bar',
            'dar',
            'zar'
        ], false);

        function check(values, shouldExist) {
            values.forEach(function(name) {
                if (shouldExist) {
                    should(that.resolver(name)).equal(true);
                } else {
                    should(that.resolver(name)).equal(undefined);
                }
            });
        }
    });

    it('should store lifetimes values when adding an item', function() {
        this.resolver.add('foo', 'foo', 1);
        this.resolver.lifetimes.foo.should.equal(1);
    });

    it('should store lifetimes values when adding an item using set', function() {
        this.resolver.set('foo', 'foo', 1);
        this.resolver.lifetimes.foo.should.equal(1);
    });

    it('should reduce lifetime values when resolving an item', function() {
        this.resolver.add('foo', 'foo', 2);
        this.resolver.lifetimes.foo.should.equal(2);
        this.resolver('foo');
        this.resolver.lifetimes.foo.should.equal(1);
    });

    it('should reduce lifetime values when resolving an item using get', function() {
        this.resolver.add('foo', 'foo', 2);
        this.resolver.lifetimes.foo.should.equal(2);
        this.resolver.get('foo');
        this.resolver.lifetimes.foo.should.equal(1);
    });

    it('should remove lifetime values and items when resolving an item and its lifetime has reached 0', function() {
        this.resolver.add('foo', 'foo', 1);
        this.resolver.lifetimes.foo.should.equal(1);
        this.resolver('foo').should.equal('foo');
        should(this.resolver('foo')).not.be.ok;
    });

    it('should remove lifetime values and items when resolving an item using get and its lifetime has reached 0', function() {
        this.resolver.add('foo', 'foo', 1);
        this.resolver.lifetimes.foo.should.equal(1);
        this.resolver.get('foo').should.equal('foo');
        should(this.resolver('foo')).not.be.ok;
    });
});
