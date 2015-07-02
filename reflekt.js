'use strict';

/**
 @module reflekt
 */

var FN_ARGS        = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
    FN_ARG_SPLIT   = /,/,
    FN_ARG         = /^\s*(_?)(\S+?)\1\s*$/,
    STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

/**
 creates a new ObjectResolver
 @static
 @params {Object} [items] - the items to initially store when creating the ObjectResolver
 @returns {Function} the created ObjectResolver. see {@link ObjectResolver~resolve}.
 */
function ObjectResolver(items) {
    var lifetimes = {};

    /**
     attempts to resolve an item with the given name.

     NOTE: the ObjectResolver is callable directly, which is an alias to this function.
     @param {String} name - the name of the item to add
     @returns {Object|undefined} the resolved item, or undefined if it was not found
     */
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

    /**
     adds an item using the given name, value and lifetime
     @param {String} name - the name of the item to add
     @param {Object} value - the value of the item to store
     @param {Integer} [lifetime] - how many times the item can be resolved before being removed automatically
     */
    function add(name, value, lifetime) {
        items[name] = value;

        if (lifetime) {
            lifetimes[name] = lifetime;
        }
    }

    /**
     removes an item with the given name from the ObjectResolver
     @param {String} name - the name of the item to remove
     */
    function remove(name) {
        delete items[name];
    }

    resolve.items = items;
    resolve.lifetimes = lifetimes;
    resolve.add = add;
    resolve.remove = remove;
    resolve.resolve = resolve;
    resolve.add('resolver', resolve);

    return resolve;
}

/**
 calls the function using the given resolver and context
 @static
 @param {Function|String|Array} fn - the function to call
 @param {Function|Object} [resolver] - the resolver to use to resolve the function's arguments
 @param {Object} [context] - the context to call the function in
 @returns {Object} the result of the function call
 */
function call(fn, resolver, context) {
    resolver = verifyResolver(resolver);
    fn = resolveFunction(fn, resolver);
    context = context || fn;
    var params = injections(fn, resolver);
    fn = isArray(fn) ? fn[fn.length - 1] : fn;
    return fn.apply(context, params) || context;
}

/**
 creates a function that takes a function/string and a context, calling the function in the given context using the
 given resolver
 @static
 @param {Function|Object} [resolver] - the resolver to use to resolve the function's arguments
 @returns {Function} the function that calls other functions
 */
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

/**
 constructs a new copy of the given klass using the given resolver and context
 @static
 @param {Function|String} klass - the object to construct a new copy of
 @param {Function|Object} [resolver] - the resolver to use to resolve the class constructor's arguments
 @param {Object} [context] - the context to call the class constructor in
 @returns {Object} the result of the call to the class constructor
 */
function construct(klass, resolver, context) {
    resolver = verifyResolver(resolver);
    klass = resolveFunction(klass, resolver);

    function Constructor() {
        return call(klass, resolver, context || this);
    }

    Constructor.prototype = (klass && klass.prototype) || {};
    return new Constructor();
}

/**
 creates a function that takes a class and context, creating a new copy of the class in the given context using the
 given resolver
 @static
 @param {Function|Object} [resolver] - the resolver to use to resolve the class constructor's arguments
 @returns {Function} the function that constructs other objects
 */
function constructor(resolver) {
    return function constructor(klass, context) {
        return construct(klass, resolver, context);
    };
}

/**
 creates a function that calls the given function using the given resolver in the given context
 @static
 @param {Function|String} fn - the function to resolve the arguments for
 @param {Function|Object} [resolver] - the resolver to use to resolve the function's arguments
 @param {Object} [context] - the context to call the function in
 @returns {Object} a function that takes no arguments and returns the result of calling the given function
 */
function decorate(fn, resolver, context) {
    return function decorated() {
        return call(fn, resolver, context);
    };
}

/**
 checks if the given function has the given argument(s)
 @param {Function} fn - the function to check
 @param {String|Array} args - the args to check
 @returns {Boolean} true if the argument(s) are found in the function signature, false otherwise
 */
function has(fn, args) {
    var parsed = parse(fn);

    if (isArray(args)) {
        return args.every(check);
    } else {
        return check(args);
    }

    function check(arg) {
        return parsed.indexOf(arg) !== -1;
    }
}

/**
 resolves the function's arguments using the given resolver
 @static
 @param {Function|String|Array} fn - the function to resolve the arguments for
 @param {Function|Object} [resolver] - the resolver to use to resolve the function's arguments
 @returns {Array} the functions resolved arguments, in order of appearance in the function's signature
 */
function injections(fn, resolver) {
    resolver = verifyResolver(resolver);
    fn = resolveFunction(fn, resolver);
    var params;

    if (isArray(fn)) {
        params = fn.slice(0, fn.length - 1);
    } else {
        params = parse(fn);
    }

    return params.map(resolver);
}

/**
 checks if the given item is of the given type by calling `Object.toString` on the item and doing an comparison between
 the result and the given kind
 @static
 @param {Object} item - the item to check the type of
 @param {String} kind - the type expected, in the form of '[object Object]'
 @returns {Boolean} true if the item is of the same type, false otherwise
 */
function isKind(item, kind) {
    return Object.prototype.toString.call(item) === kind;
}

/**
 checks if the given item is an array
 @static
 @param {Object} item - the item to check the type of
 @returns {Boolean} true if the item is an array, false otherwise
 */
function isArray(item) {
    return (Array.isArray && Array.isArray(item)) || isKind(item, '[object Array]');
}

/**
 checks if the given item is an object
 @static
 @param {Object} item - the item to check the type of
 @returns {Boolean} true if the item is an object, false otherwise
 */
function isObject(item) {
    return isKind(item, '[object Object]');
}

/**
 checks if the given item is a string
 @static
 @param {Object} item - the item to check the type of
 @returns {Boolean} true if the item is a string, false otherwise
 */
function isString(item) {
    return isKind(item, '[object String]');
}

/**
 parses the function's arguments, returning an array of the arguments found
 @static
 @param {Function|String} fn - the function to parse the arguments for
 @returns {Array} the functions arguments, in order of appearance in the function's signature
 */
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
    has:            has,
    injections:     injections,
    isKind:         isKind,
    isArray:        isArray,
    isObject:       isObject,
    isString:       isString,
    parse:          parse
};

// some older JS engines (like PhantomJS 1.9.X and below) do not include the `bind` Function method
// this polyfill was taken from:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Polyfill
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

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every#Polyfill
if (!Array.prototype.every) {
    Array.prototype.every = function(callbackfn, thisArg) {
        'use strict';
        var T, k;

        if (this == null) {
            throw new TypeError('this is null or not defined');
        }

        // 1. Let O be the result of calling ToObject passing the this
        //    value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal method
        //    of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If IsCallable(callbackfn) is false, throw a TypeError exception.
        if (typeof callbackfn !== 'function') {
            throw new TypeError();
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 1) {
            T = thisArg;
        }

        // 6. Let k be 0.
        k = 0;

        // 7. Repeat, while k < len
        while (k < len) {

            var kValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal
            //    method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal method
                //    of O with argument Pk.
                kValue = O[k];

                // ii. Let testResult be the result of calling the Call internal method
                //     of callbackfn with T as the this value and argument list
                //     containing kValue, k, and O.
                var testResult = callbackfn.call(T, kValue, k, O);

                // iii. If ToBoolean(testResult) is false, return false.
                if (!testResult) {
                    return false;
                }
            }
            k++;
        }
        return true;
    };
}
