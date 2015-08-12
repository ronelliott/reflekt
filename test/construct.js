'use strict';

var should = require('should'),
    construct = require('../reflekt').construct;

describe('construct', function() {
    it('should allow an object to be passed for resolutions', function() {
        function Foo(bar) {
            bar.should.equal('bar');
            this.foo = true;
        }

        var foo = construct(Foo, { bar: 'bar' });
        should(foo).be.ok;
        foo.foo.should.equal(true);
    });

    it('should allow a function to be passed for resolutions', function() {
        var called = false;

        function Foo(bar) {
            bar.should.equal('bar');
            this.foo = true;
        }

        function resolver(name) {
            called = true;
            return name;
        }

        var foo = construct(Foo, resolver);
        should(foo).be.ok;
        foo.foo.should.equal(true);
    });

    it('should set the functions prototype correctly', function() {
        function Foo() {}

        Foo.prototype = { foo: true };

        var foo = construct(Foo);
        should(foo).be.ok;
        foo.foo.should.equal(true);
    });

    it('should return an object that pass `instanceof` checks', function() {
        function Foo() {}

        Foo.prototype = { foo: true };

        var foo = construct(Foo);
        should(foo).be.ok;
        foo.foo.should.equal(true);
        should(foo instanceof Foo).equal(true);
    });

    it('should allow an array to be passed with resolution names and the function to be called', function() {
        function Foo(bar) {
            bar.should.equal('dar');
            this.foo = true;
        }

        var foo = construct(['dar', Foo], { bar: 'bar', dar: 'dar' });
        should(foo).be.ok;
        foo.foo.should.equal(true);
    });

    it('should allow a string to be passed in place of a function', function() {
        function Foo() {
            this.foo = true;
        }

        var foo = construct('Foo', { Foo: Foo });
        should(foo).be.ok;
        foo.foo.should.equal(true);
    });

    it('should allow an array of resolvers to be passed', function() {
        var called = false;

        function Foo(foo, bar) {
            called = true;
            foo.should.equal('foo');
            bar.should.equal('bar');
        }

        construct(Foo, [ { bar: 'bar' }, { foo: 'foo' } ]);
        called.should.equal(true);
    });
});
