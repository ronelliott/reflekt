'use strict';

// some older JS engines (like PhantomJS 1.9.X and below) do not include the `bind` Function method
// this polyfill was taken from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Polyfill
if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs   = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP    = function() {},
                fBound  = function() {
                    return fToBind.apply(this instanceof fNOP
                                 ? this
                                 : oThis,
                                 aArgs.concat(Array.prototype.slice.call(arguments)));
                };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

function isArray(item) {
    return Array.isArray(item) || (typeof item === 'object' && Object.prototype.toString.call(item) === '[object Array]');
}

function isObject(item) {
    return typeof item === 'object';
}

var FN_ARGS        = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
    FN_ARG_SPLIT   = /,/,
    FN_ARG         = /^\s*(_?)(\S+?)\1\s*$/,
    STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

function ObjectResolver(items) {
    return function resolve(name) {
        return items[name];
    };
}

function args(fn) {
    var matches = fn
        .toString()
        .replace(STRIP_COMMENTS, '')
        .match(FN_ARGS);

    if (matches) {
        return matches[1]
            .split(FN_ARG_SPLIT)
            .map(function(arg) {
                return arg.replace(FN_ARG, function(all, underscore, name) {
                    return name;
                });
            });
    }

    return [];
}

function injections(fn, resolver) {
    var params = isArray(fn) ? fn : args(fn),
        resolve = isObject(resolver) ? ObjectResolver(resolver) : resolver;
    return params.map(resolve.bind(resolve));
}

function decorate(fn, resolver, context) {
    var params = [];

    if (isArray(fn)) {
        params = injections(fn.slice(0, fn.length - 1), resolver);
        fn = fn.slice(fn.length - 1)[0];
    } else {
        params = injections(fn, resolver);
    }

    return function decorated() {
        return fn.apply(context || fn, params);
    };
}

function call(fn, resolver, context) {
    var func = decorate(fn, resolver, context);
    return func();
}

function caller(resolver) {
    return function caller(fn, context) {
        return call(fn, resolver, context);
    };
}

module.exports = {
    ObjectResolver: ObjectResolver,
    args:           args,
    decorate:       decorate,
    call:           call,
    caller:         caller,
    injections:     injections,
};
