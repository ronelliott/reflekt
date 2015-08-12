'use strict';

var should = require('should'),
    caller = require('../reflekt').caller;

describe('caller', function() {
    it('should return a function that calls other functions', function() {
        var theCaller = caller(),
            called = false;

        function foo() {
            called = true;
        }

        theCaller(foo);
        called.should.equal(true);
    });

    it('should return a function that has the resolver as a property', function() {
        var theCaller = caller();
        should(theCaller.resolver).be.ok;
    });

    it('should return the value the function called returns', function() {
        var theCaller = caller({ bar: 'bar' }),
            called = false;

        function foo(bar) {
            called = true;
            bar.should.equal('bar');
            return 'flubber';
        }

        theCaller(foo).should.equal('flubber');
        called.should.equal(true);
    });

    it('should allow an object to be passed for resolutions', function() {
        var theCaller = caller({ bar: 'bar' }),
            called = false;

        function foo(bar) {
            called = true;
            bar.should.equal('bar');
        }

        theCaller(foo);
        called.should.equal(true);
    });

    it('should allow a function to be passed for resolutions', function() {
        var theCaller = caller(resolver),
            called = { func: false, resolver: false };

        function foo(bar) {
            called.func = true;
            bar.should.equal('bar');
        }

        function resolver(name) {
            called.resolver = true;
            return name;
        }

        theCaller(foo);
        called.func.should.equal(true);
        called.resolver.should.equal(true);
    });


    it('should allow an array to be passed with resolution names and the function to be called', function() {
        var theCaller = caller({ bar: 'bar', dar: 'dar' }),
            called = false;

        function foo(bar) {
            called = true;
            bar.should.equal('dar');
        }

        theCaller(['dar', foo]);
        called.should.equal(true);
    });

    it('should add the caller to the resolver if an object is passed for resolutions', function() {
        var theCaller = caller({}),
            called = false;

        function foo(caller) {
            called = true;
            caller.should.be.ok;
            caller.should.equal(theCaller);
        }

        theCaller(foo);
        called.should.equal(true);
    });

    it('should allow a string to be passed in place of a function', function() {
        var theCaller = caller({ bar: 'bar', foo: foo }),
            called = false;

        function foo(bar) {
            called = true;
            bar.should.equal('bar');
        }

        theCaller('foo');
        called.should.equal(true);
    });

    it('should provide a proxy method for its resolvers add method', function() {
        var theCaller = caller();
        should(theCaller.add).be.ok();
        theCaller.add('foo', 'foo');
        theCaller.resolver('foo').should.equal('foo');
    });

    it('should provide a proxy method for its resolvers remove method', function() {
        var theCaller = caller({ foo: 'foo' });
        theCaller.resolver('foo').should.equal('foo');
        should(theCaller.remove).be.ok();
        theCaller.remove('foo');
        should(theCaller.resolver('foo')).not.be.ok();
    });

    it('should allow an array of resolvers to be passed', function() {
        var called = false,
            theCaller = caller([ { bar: 'bar' }, { foo: 'foo' } ]);

        function spy(foo, bar) {
            called = true;
            foo.should.equal('foo');
            bar.should.equal('bar');
        }

        theCaller(spy);
        called.should.equal(true);
    });

    it('should allow a function to be passed to augment the call', function() {
        var theCaller = caller(),
            called = false;

        function spy(foo, bar, dar) {
            called = true;
            foo.should.equal('foo');
            bar.should.equal('bar');
            dar.should.equal('dar');
        }

        theCaller(spy, null, function(name) { return name; });
        called.should.equal(true);
    });

    it('should allow an object to be passed to augment the call', function() {
        var theCaller = caller({ foo: 'foo', bar: 'bar' }),
            called = false;

        function spy(foo, bar, dar) {
            called = true;
            foo.should.equal('foo');
            bar.should.equal('bar');
            dar.should.equal('dar');
        }

        theCaller(spy, null, { dar: 'dar' });
        called.should.equal(true);
    });

    it('should allow an array of resolvers to be passed to augment the call', function() {
        var theCaller = caller({ foo: 'foo', bar: 'bar' }),
            called = false;

        function spy(foo, bar, dar) {
            called = true;
            foo.should.equal('foo');
            bar.should.equal('bar');
            dar.should.equal('dar');
        }

        theCaller(spy, null, [ { dar: 'dar' } ]);
        called.should.equal(true);
    });

    it('should return the value the function called returns if an array of resolvers is passed', function() {
        var theCaller = caller({ bar: 'bar' }),
            called = false;

        function foo(bar) {
            called = true;
            bar.should.equal('bar');
            return 'flubber';
        }

        theCaller(foo, null, [ { dar: 'dar' } ]).should.equal('flubber');
        called.should.equal(true);
    });
});
