'use strict';

var should = require('should'),
    sinon = require('sinon'),
    reflekt = require('./index');

describe('reflekt', function() {
    it('call should work correctly', function(done) {
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

    it('call should return the result of the function', function(done) {
        var called = false,
            items = { bar: 'foo' };

        function foo(bar) {
            called = true;
            return bar;
        }

        called = false;
        called.should.not.be.ok;
        reflekt.call(foo, items).should.equal(items.bar);
        called.should.be.ok;

        done();
    });

    it('call should return the result of the function', function(done) {
        var called = false,
            items = { bar: 'foo' },
            caller = reflekt.caller(items);

        function foo(bar) {
            called = true;
            return bar;
        }

        called = false;
        called.should.not.be.ok;
        caller(foo, items).should.equal(items.bar);
        called.should.be.ok;

        done();
    });

    it('caller should work correctly', function(done) {
        var called = false,
            items = { bar: 'foo', dar: 'yup' },
            resolve = new reflekt.ObjectResolver(items),
            caller = reflekt.caller(resolve);

        function asdf(bar, dar) {
            called = true;
            bar.should.equal('foo');
            dar.should.equal('yup');
        }

        called.should.not.be.ok;
        caller(asdf);
        called.should.be.ok;
        done();
    });

    it('contexts should work correctly', function(done) {
        var called = false,
            context = { foo: 'foo' },
            items = { bar: 'foo', dar: 'yup' },
            resolve = new reflekt.ObjectResolver(items),
            caller = reflekt.caller(resolve);

        function asdf(bar, dar) {
            called = true;
            bar.should.equal('foo');
            dar.should.equal('yup');
            should(this.foo).equal('foo');
        }

        called.should.not.be.ok;
        caller(asdf, context);
        called.should.be.ok;
        done();
    });

    it('should automatically translate object resolvers', function(done) {
        var called = false,
            items = { bar: 'foo', dar: 'yup' },
            caller = reflekt.caller(items);

        function asdf(bar, dar) {
            called = true;
            bar.should.equal('foo');
            dar.should.equal('yup');
        }

        called.should.not.be.ok;
        caller(asdf);
        called.should.be.ok;
        done();
    });

    describe('api', function() {
        describe('args', function() {
            it('should parse functions with comments correctly', function(done) {
                var fn = function(c/*a parameter*/, a, // More parameters
                                 /* Interesting */ r) { };
                reflekt.args(fn).should.eql([ 'c', 'a', 'r']);
                done();
            });
        });

        describe('call', function() {
            it('should call the function', function(done) {
                var resolve = sinon.spy(),
                    spy = sinon.spy();
                reflekt.call(spy, resolve);
                spy.called.should.be.ok;
                resolve.called.should.not.be.ok;
                done();
            });
        });

        describe('caller', function() {
            it('should return a call generator', function(done) {
                var resolve = sinon.spy(),
                    spy = sinon.spy(),
                    caller = reflekt.caller(resolve);
                caller(spy);
                spy.called.should.be.ok;
                resolve.called.should.not.be.ok;
                done();
            });
        });

        describe('injections', function() {
            it('should return the requested args', function(done) {
                var resolve = sinon.spy(function() { return 'foo'; }),
                    injections = reflekt.injections([ 'foo' ], resolve);
                injections.should.eql([ 'foo' ]);
                done();
            });

            it('should translate the resolver correctly', function(done) {
                var resolve = { foo: 'foo' },
                    injections = reflekt.injections([ 'foo' ], resolve);
                injections.should.eql([ 'foo' ]);
                done();
            });
        });

        describe('decorate', function() {
            it('should return a decorated function', function(done) {
                var resolve = sinon.spy(),
                    spy = sinon.spy(),
                    result = reflekt.decorate(spy, resolve);
                spy.called.should.not.be.ok;
                result();
                spy.called.should.be.ok;
                done();
            });

            it('should work with angular style strict injections', function(done) {
                var resolve = sinon.spy(),
                    spy = sinon.spy(),
                    result = reflekt.decorate([spy], resolve);
                spy.called.should.not.be.ok;
                result();
                spy.called.should.be.ok;
                done();
            });

            it('should use the correct context', function(done) {
                var resolve = sinon.spy(),
                    context = { foo: 'foo' },
                    spy = sinon.spy(function() { should(this.foo).equal('foo'); }),
                    result = reflekt.decorate(spy, resolve, context);
                spy.called.should.not.be.ok;
                result();
                spy.called.should.be.ok;
                done();
            });
        });
    });

    describe('resolvers', function() {
        describe('ObjectResolver', function() {
            it('should resolve items found', function(done) {
                var resolve = new reflekt.ObjectResolver({ foo: 'bar' });
                resolve('foo').should.equal('bar');
                done();
            });

            it('should not resolve items not found', function(done) {
                var resolve = new reflekt.ObjectResolver({ foo: 'bar' });
                should(resolve('bar')).not.be.ok;
                done();
            });
        });
    });
});
