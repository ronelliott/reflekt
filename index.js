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
    function resolve(name) {
        return items[name];
    }

    resolve.add = function(name, value) {
        items[name] = value;
    };

    resolve.remove = function(name) {
        delete items[name];
    };

    resolve.items = items;

    return resolve;
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
    resolver = resolver || {};
    var params = isArray(fn) ? fn : args(fn),
        resolve = isObject(resolver) ? new ObjectResolver(resolver) : resolver;
    return params.map(resolve.bind(resolve));
}

function params(fn, resolver) {
    var theParams = [];

    if (isArray(fn)) {
        theParams = injections(fn.slice(0, fn.length - 1), resolver);
    } else {
        theParams = injections(fn, resolver);
    }

    return theParams;
}

function decorate(fn, resolver, context) {
    fn = typeof(fn) === 'string' ? resolver(fn) : fn;
    context = context || fn;

    var theArgs = params(fn, resolver);

    if (isArray(fn)) {
        fn = fn.slice(fn.length - 1)[0];
    }

    return function decorated() {
        return fn.apply(context, theArgs) || context;
    };
}

function call(fn, resolver, context) {
    return decorate(fn, resolver, context)();
}

function construct(fn, resolver, context) {
    fn = typeof(fn) === 'string' ? resolver(fn) : fn;

    function ctor() {
        return call(fn, resolver, context || this);
    }

    ctor.prototype = fn.prototype || {};
    return new ctor();
}

function constructor(fn, resolver, context) {
    return function constructor() {
        return construct(fn, resolver, context);
    };
}

function caller(resolver) {
    resolver = isObject(resolver) ? new ObjectResolver(resolver) : resolver;

    function theCaller(fn, context) {
        return call(fn, resolver, context);
    }

    theCaller.resolver = resolver;

    return theCaller;
}

module.exports = {
    ObjectResolver: ObjectResolver,
    args:           args,
    call:           call,
    caller:         caller,
    construct:      construct,
    constructor:    constructor,
    decorate:       decorate,
    injections:     injections
};
