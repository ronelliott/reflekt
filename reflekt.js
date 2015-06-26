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

var FN_ARGS        = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
    FN_ARG_SPLIT   = /,/,
    FN_ARG         = /^\s*(_?)(\S+?)\1\s*$/,
    STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

function ObjectResolver(items) {
    var lifetimes = {};

    function resolve(name) {
        if (name in lifetimes) {
            lifetimes[name]--;

            if (lifetimes[name] <= 0) {
                delete items[name];
                delete lifetimes[name];
            }
        }

        return items[name];
    }

    function add(name, value, lifetime) {
        items[name] = value;

        if (lifetime) {
            lifetimes[name] = lifetime;
        }
    }

     function remove(name) {
        delete items[name];
    }

    resolve.items = items;
    resolve.lifetimes = lifetimes;
    resolve.add = add;
    resolve.remove = remove;
    resolve.add('resolver', resolve);

    return resolve;
}

function call(fn, resolver, context) {
    return decorate(fn, resolver, context)();
}

function caller(resolver) {
    resolver = resolver || {};

    function theCaller(fn, context) {
        return call(fn, resolver, context);
    }

    if (isObject(resolver)) {
        resolver = new ObjectResolver(resolver);
        resolver.add('caller', theCaller);
    }

    theCaller.resolver = resolver;
    return theCaller;
}

function construct(fn, resolver, context) {
    resolver = verifyResolver(resolver);
    fn = resolveFunction(fn, resolver);

    function Constructor() {
        return call(fn, resolver, context || this);
    }

    Constructor.prototype = (fn && fn.prototype) || {};
    return new Constructor();
}

function constructor(fn) {
    return function constructor(resolver, context) {
        return construct(fn, resolver, context);
    };
}

function decorate(fn, resolver, context) {
    resolver = verifyResolver(resolver);
    fn = resolveFunction(fn, resolver);
    context = context || fn;

    var theParams = params(fn, resolver);

    if (isArray(fn)) {
        fn = fn.slice(fn.length - 1)[0];
    }

    return function decorated() {
        return fn.apply(context, theParams) || context;
    };
}

function injections(fn, resolver) {
    resolver = verifyResolver(resolver);
    fn = resolveFunction(fn, resolver);
    var params = isArray(fn) ? fn : parse(fn);
    return params.map(resolver);
}

function isKind(item, kind) {
    return Object.prototype.toString.call(item) === kind;
}

function isArray(item) {
    return (Array.isArray && Array.isArray(item)) || isKind(item, '[object Array]');
}

function isObject(item) {
    return isKind(item, '[object Object]');
}

function isString(item) {
    return isKind(item, '[object String]');
}

function params(fn, resolver) {
    resolver = verifyResolver(resolver);
    fn = resolveFunction(fn, resolver);

    var theParams = [];

    if (isArray(fn)) {
        theParams = injections(fn.slice(0, fn.length - 1), resolver);
    } else {
        theParams = injections(fn, resolver);
    }

    return theParams;
}

function parse(fn) {
    if (!fn) {
        throw new Error('Function is not defined!');
    }

    var matches = fn
        .toString()
        .replace(STRIP_COMMENTS, '')
        .match(FN_ARGS);

    if (matches) {
        return matches[1]
            .split(FN_ARG_SPLIT)
            .filter(function(arg) {
                return arg.length > 0;
            })
            .map(function(arg) {
                return arg.replace(FN_ARG, function(all, underscore, name) {
                    return name;
                });
            });
    }

    return [];
}

function resolveFunction(fn, resolver) {
    return isString(fn) ? resolver(fn) : fn;
}

function verifyResolver(resolver) {
    resolver = resolver || {};
    return isObject(resolver) ? new ObjectResolver(resolver || {}) : resolver;
}

module.exports = {
    ObjectResolver: ObjectResolver,
    call:           call,
    caller:         caller,
    construct:      construct,
    constructor:    constructor,
    decorate:       decorate,
    injections:     injections,
    isKind:         isKind,
    isArray:        isArray,
    isObject:       isObject,
    isString:       isString,
    params:         params,
    parse:          parse
};
