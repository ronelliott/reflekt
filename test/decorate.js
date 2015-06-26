'use strict';

var should = require('should'),
    decorate = require('../reflekt').decorate;

describe('decorate', function() {
    it('should return a function that call the given function', function() {
        var called = false;

        function spy() {
            called = true;
        }

        var decorated = decorate(spy);
        decorated.should.be.a.Function;
        decorated();
        called.should.equal(true);
    });

    it('should allow an array to be passed with resolution names and the function to be called', function() {
        var called = false;

        function spy() {
            called = true;
        }

        var decorated = decorate([ spy ]);
        decorated.should.be.a.Function;
        decorated();
        called.should.equal(true);
    });

    it('should allow an object to be passed for resolutions', function() {
        var called = false;

        function spy(foo, bar) {
            called = true;
            foo.should.equal('foo');
            bar.should.equal('bar');
        }

        var decorated = decorate(spy, { foo: 'foo', bar: 'bar' });
        decorated.should.be.a.Function;
        decorated();
        called.should.equal(true);
    });

    it('should allow a function to be passed for resolutions', function() {
        var called = false;

        function spy(foo, bar) {
            called = true;
            foo.should.equal('foo');
            bar.should.equal('foo');
        }

        var decorated = decorate(spy, function() { return 'foo'; });
        decorated.should.be.a.Function;
        decorated();
        called.should.equal(true);
    });

    it('should allow a string to be passed in place of a function', function() {
        var called = false;

        function spy(bar) {
            called = true;
            bar.should.equal('bar');
        }

        var decorated = decorate('spy', { spy: spy, bar: 'bar' });
        decorated.should.be.a.Function;
        decorated();
        called.should.equal(true);
    });
});
