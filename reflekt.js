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
    items = items || {};
    var lifetimes = {};

    /**
     attempts to resolve an item with the given name.

     NOTE: the ObjectResolver is callable directly, which is an alias to this function.
     @param {String} name - the name of the item to add
     @returns {Object|undefined} the resolved item, or undefined if it was not found
     */
    function resolve(name) {
        if (name in lifetimes) {
            if (lifetimes[name] <= 0) {
                delete items[name];
                delete lifetimes[name];
            } else {
                lifetimes[name]--;
            }
        }

        return items[name];
    }

    /**
     adds an item using the given name, value and lifetime
     @param {String|Object} name - the name of the item to add. if an object is passed all items will be added
     @param {Object} [value] - the value of the item to store
     @param {Integer} [lifetime] - how many times the item can be resolved before being removed automatically
     */
    function add(name, value, lifetime) {
        if (isObject(name)) {
            lifetime = value;
            value = null;
            Object.keys(name).forEach(function(n) {
                var v = name[n];
                doAdd(n, v, lifetime);
            });
        } else {
            doAdd(name, value, lifetime);
        }

        function doAdd(n, v, l) {
            items[n] = v;

            if (l) {
                lifetimes[n] = l;
            }
        }
    }

    /**
     attempts to resolve an item with the given name.

     NOTE: the ObjectResolver is callable directly, which is an alias to this function.
     @param {String} name - the name of the item to add
     @returns {Object|undefined} the resolved item, or undefined if it was not found
     */
    function get(name) {
        return resolve(name);
    }

    /**
     checks if the item exists in the resolver
     @param {String} name - the name of the item to check
     @returns {Boolean} true if the ObjectResolver has the item, false otherwise
     */
    function has(name) {
        return name in items;
    }

    /**
     removes an item with the given name from the ObjectResolver
     @param {String|Array} name - the name(s) of the item to remove
     */
    function remove(name) {
        if (isArray(name)) {
            name.forEach(function(name) {
                delete items[name];
            });
        } else {
            delete items[name];
        }
    }

    /**
     adds an item using the given name, value and lifetime
     @param {String|Object} name - the name of the item to add. if an object is passed all items will be added
     @param {Object} [value] - the value of the item to store
     @param {Integer} [lifetime] - how many times the item can be resolved before being removed automatically
     */
    function set(name, value, lifetime) {
        return add(name, value, lifetime);
    }

    resolve.items = items;
    resolve.lifetimes = lifetimes;
    resolve.add = add;
    resolve.get = get;
    resolve.has = has;
    resolve.remove = remove;
    resolve.resolve = resolve;
    resolve.set = set;
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
    return fn.apply(context, params);
}

/**
 creates a function that takes a function/string and a context, calling the function in the given context using the
 given resolver
 @static
 @param {Function|Object|Array} [resolver] - the resolver to use to resolve the function's arguments
 @returns {Function} the function that calls other functions
 */
function caller(resolver) {
    resolver = resolver || {};

    function theCaller(fn, context, extras) {
        if (extras) {
            var resolvers = [];

            if (isArray(resolver)) {
                resolvers = resolvers.concat(resolver);
            } else {
                resolvers.push(resolver);
            }

            if (isArray(extras)) {
                resolvers = resolvers.concat(extras);
            } else {
                resolvers.push(extras);
            }

            return call(fn, resolvers, context);
        }

        return call(fn, resolver, context);
    }

    if (isObject(resolver)) {
        resolver = new ObjectResolver(resolver);
        resolver.add('caller', theCaller);
    }

    theCaller.resolver = resolver;
    theCaller.add = theCaller.resolver.add;
    theCaller.remove = theCaller.resolver.remove;
    return theCaller;
}

/**
 constructs a new copy of the given klass using the given resolver and context
 @static
 @param {Function|String} klass - the object to construct a new copy of
 @param {Function|Object|Array} [resolver] - the resolver to use to resolve the class constructor's arguments
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
 @param {Function|Object|Array} [resolver] - the resolver to use to resolve the class constructor's arguments
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
 @param {Function|Object|Array} [resolver] - the resolver to use to resolve the function's arguments
 @param {Object} [context] - the context to call the function in
 @returns {Object} a function that takes no arguments and returns the result of calling the given function
 */
function decorate(fn, resolver, context) {
    return function decorated() {
        return call(fn, resolver, context);
    };
}

/**
 calls the callback on each item in the array
 @returns {Boolean} true if all calls return true, or false otherwise
 */
function every(items, callback) {
    for (var i = 0; i < items.length; i++) {
        if (!callback(items[i])) {
            return false;
        }
    }

    return true;
}

/**
 checks if the given function has the given argument(s)
 @static
 @param {Function} fn - the function to check
 @param {String|Array} args - the args to check
 @returns {Boolean} true if the argument(s) are found in the function signature, false otherwise
 */
function has(fn, args) {
    if (!fn) {
        return false;
    }

    var parsed = parse(fn);

    if (isArray(args)) {
        return every(args, check);
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
 @param {Function|Object|Array} [resolver] - the resolver(s) to use to resolve the function's arguments
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

    if (isArray(resolver)) {
        return params.map(function(name) {
            var resolved;

            resolver.forEach(function(res) {
                if (!resolved) {
                    resolved = res(name);
                }
            });

            return resolved;
        });
    } else {
        return params.map(resolver);
    }
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

    return !isArray(matches) ? [] : matches[1]
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

/**
 resolve the function from the given resolver(s) if the passed fn is a string,
 otherwise the given fn is returned
 @private
 @static
 @param {Function|String} fn - the function to resolve
 @param {Function|Object|Array} [resolver] - the resolver(s) to use
 @returns {Function} the resolved function, or undefined if not found
 */
function resolveFunction(fn, resolver) {
    if (isString(fn)) {
        if (isArray(resolver)) {
            var resolved;

            resolver.map(function(res) {
                if (!resolved) {
                    resolved = verifyResolver(res)(fn);
                }
            });

            fn = resolved;
        } else {
            fn = verifyResolver(resolver)(fn);
        }
    }

    return fn;
}

/**
 verifies the existence of a resolver, translating any objects to ObjectResolvers
 @private
 @static
 @param {Function|Object|Array} [resolver] - the resolver(s) to verify the existence of
 @returns {Function|Array} the resolver(s)
 */
function verifyResolver(resolver) {
    if (isArray(resolver)) {
        return resolver.map(function(res) {
            return isObject(res) ? new ObjectResolver(res) : res;
        });
    }

    resolver = resolver || {};
    return isObject(resolver) ? new ObjectResolver(resolver || {}) : resolver;
}

module.exports = {
    ObjectResolver:  ObjectResolver,
    call:            call,
    caller:          caller,
    construct:       construct,
    constructor:     constructor,
    decorate:        decorate,
    every:           every,
    has:             has,
    injections:      injections,
    isKind:          isKind,
    isArray:         isArray,
    isObject:        isObject,
    isString:        isString,
    parse:           parse,
    resolveFunction: resolveFunction,
    verifyResolver:  verifyResolver
};
