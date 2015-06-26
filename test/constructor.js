'use strict';

var should = require('should'),
    constructor = require('../reflekt').constructor;

describe('constructor', function() {
    it('should return a function that constructs new instances when called', function() {
        var theConstructor = constructor(Foo);

        function Foo() {
            this.foo = true;
        }

        var foo = theConstructor();
        should(foo).be.ok;
        foo.foo.should.equal(true);
    });

    it('should return an object that pass `instanceof` checks', function() {
        var theConstructor = constructor(Foo);

        function Foo() {}

        Foo.prototype = { foo: true };

        var foo = theConstructor({ bar: 'bar' });
        should(foo).be.ok;
        foo.foo.should.equal(true);
        should(foo instanceof Foo).equal(true);
    });

    it('should allow an object to be passed for resolutions', function() {
        var theConstructor = constructor(Foo);

        function Foo(bar) {
            bar.should.equal('bar');
            this.foo = true;
        }

        var foo = theConstructor({ bar: 'bar' });
        should(foo).be.ok;
        foo.foo.should.equal(true);
    });

    it('should allow a function to be passed for resolutions', function() {
        var theConstructor = constructor(Foo),
            called = false;

        function Foo(bar) {
            bar.should.equal('bar');
            this.foo = true;
        }

        function resolver(name) {
            called = true;
            return name;
        }

        var foo = theConstructor(resolver);
        called.should.equal(true);
        should(foo).be.ok;
        foo.foo.should.equal(true);
    });

    it('should allow an array to be passed with resolution names and the function to be called', function() {
        var theConstructor = constructor(['dar', Foo]);

        function Foo(bar) {
            bar.should.equal('dar');
            this.foo = true;
        }

        var foo = theConstructor({ bar: 'bar', dar: 'dar' });
        should(foo).be.ok;
        foo.foo.should.equal(true);
    });

    it('should allow a string to be passed in place of a function', function() {
        var theConstructor = constructor('Foo');

        function Foo() {
            this.foo = true;
        }

        var foo = theConstructor({ Foo: Foo });
        should(foo).be.ok;
        foo.foo.should.equal(true);
    });
});
