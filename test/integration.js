'use strict';

var should = require('should'),
    reflekt = require('../src');

describe('reflekt', function() {
    it('should work correctly', function(done) {
        var called = false,
            items = { bar: 'foo' },
            resolve = new reflekt.ObjectResolver(items);

        function foo(bar) {
            called = true;
            bar.should.equal(items.bar);
        }

        called.should.not.be.ok;
        reflekt.call(foo, resolve);
        called.should.be.ok;

        function asdf(bar, dar) {
            called = true;
            bar.should.equal('foo');
            dar.should.equal('yup');
        }

        items = { bar: 'foo', dar: 'yup' };
        resolve = new reflekt.ObjectResolver(items);

        called = false;
        called.should.not.be.ok;
        reflekt.call(asdf, resolve);
        called.should.be.ok;

        items = { bar: 'bar', dar: 'dar', happy: 'foo', joy: 'yup' };
        resolve = new reflekt.ObjectResolver(items);

        called = false;
        called.should.not.be.ok;
        reflekt.call(['happy', 'joy', asdf], resolve);
        called.should.be.ok;

        done();
    });
});
