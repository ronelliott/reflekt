'use strict';

var should = require('should'),
    call = require('../reflekt').call;

describe('call', function() {
    it('should call the given function', function() {
        var called = false;

        function spy() {
            called = true;
        }

        call(spy);
        called.should.equal(true);
    });

    it('should allow an array to be passed with resolution names and the function to be called', function() {
        var called = false;

        function spy() {
            called = true;
        }

        call([ spy ]);
        called.should.equal(true);
    });

    it('should allow an object to be passed for resolutions', function() {
        var called = false;

        function spy(foo, bar) {
            called = true;
            foo.should.equal('foo');
            bar.should.equal('bar');
        }

        call(spy, { foo: 'foo', bar: 'bar' });
        called.should.equal(true);
    });

    it('should allow a function to be passed for resolutions', function() {
        var called = false;

        function spy(foo, bar) {
            called = true;
            foo.should.equal('foo');
            bar.should.equal('foo');
        }

        call(spy, function() { return 'foo'; });
        called.should.equal(true);
    });

    it('should allow a string to be passed in place of a function', function() {
        var called = false;

        function spy(bar) {
            called = true;
            bar.should.equal('bar');
        }

        call('spy', { spy: spy, bar: 'bar' });
        called.should.equal(true);
    });
});
