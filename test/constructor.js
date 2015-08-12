'use strict';

var should = require('should'),
    constructor = require('../reflekt').constructor;

describe('constructor', function() {
    it('should return a function that constructs new instances when called', function() {
        var theConstructor = constructor();

        function Foo() {
            this.foo = true;
        }

        var foo = theConstructor(Foo);
        should(foo).be.ok;
        foo.foo.should.equal(true);
    });

    it('should return an object that pass `instanceof` checks', function() {
        var theConstructor = constructor({ bar: 'bar' });

        function Foo() {}

        Foo.prototype = { foo: true };

        var foo = theConstructor(Foo);
        should(foo).be.ok;
        foo.foo.should.equal(true);
        should(foo instanceof Foo).equal(true);
    });

    it('should allow an object to be passed for resolutions', function() {
        var theConstructor = constructor({ bar: 'bar' });

        function Foo(bar) {
            bar.should.equal('bar');
            this.foo = true;
        }

        var foo = theConstructor(Foo);
        should(foo).be.ok;
        foo.foo.should.equal(true);
    });

    it('should allow a function to be passed for resolutions', function() {
        var theConstructor = constructor(resolver),
            called = false;

        function Foo(bar) {
            bar.should.equal('bar');
            this.foo = true;
        }

        function resolver(name) {
            called = true;
            return name;
        }

        var foo = theConstructor(Foo);
        called.should.equal(true);
        should(foo).be.ok;
        foo.foo.should.equal(true);
    });

    it('should allow an array to be passed with resolution names and the function to be called', function() {
        var theConstructor = constructor({ bar: 'bar', dar: 'dar' });

        function Foo(bar) {
            bar.should.equal('dar');
            this.foo = true;
        }

        var foo = theConstructor(['dar', Foo]);
        should(foo).be.ok;
        foo.foo.should.equal(true);
    });

    it('should allow a string to be passed in place of a function', function() {
        var theConstructor = constructor({ Foo: Foo });

        function Foo() {
            this.foo = true;
        }

        var foo = theConstructor('Foo');
        should(foo).be.ok;
        foo.foo.should.equal(true);
    });

    it('should allow an array of resolvers to be passed', function() {
        var called = false,
            theConstructor = constructor([ { bar: 'bar' }, { foo: 'foo' } ]);

        function Foo(foo, bar) {
            called = true;
            foo.should.equal('foo');
            bar.should.equal('bar');
        }

        var foo = theConstructor(Foo);
        should(foo).be.ok;
        called.should.equal(true);
    });
});
