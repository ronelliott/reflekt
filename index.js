'use strict';

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
