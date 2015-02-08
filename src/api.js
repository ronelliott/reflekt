'use strict';

var isArray = require('util').isArray;

var FN_ARGS        = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
    FN_ARG_SPLIT   = /,/,
    FN_ARG         = /^\s*(_?)(\S+?)\1\s*$/,
    STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

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
    var params = isArray(fn) ? fn : args(fn);
    return params.map(resolver.bind(resolver));
}

function decorate(fn, resolver) {
    var params = [];

    if (isArray(fn)) {
        params = injections(fn.slice(0, fn.length - 1), resolver);
        fn = fn.slice(fn.length - 1)[0];
    } else {
        params = injections(fn, resolver);
    }

    return function() {
        fn.apply(fn, params);
    };
}

function call(fn, resolver) {
    var func = decorate(fn, resolver);
    func();
    return func;
}

module.exports = {
    args:           args,
    decorate:       decorate,
    call:           call,
};
