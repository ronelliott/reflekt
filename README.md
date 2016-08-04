# reflekt
[![view on npm](http://img.shields.io/npm/v/reflekt.svg)](https://www.npmjs.org/package/reflekt)
[![view on npm](https://img.shields.io/npm/dm/reflekt.svg)](https://www.npmjs.org/package/reflekt)
[![Dependency Status](https://david-dm.org/ronelliott/reflekt.svg)](https://david-dm.org/ronelliott/reflekt)
[![Build Status](https://travis-ci.org/ronelliott/reflekt.png)](https://travis-ci.org/ronelliott/reflekt)
[![Coverage Status](https://coveralls.io/repos/ronelliott/reflekt/badge.svg?branch=master)](https://coveralls.io/r/ronelliott/reflekt?branch=master)
[![Code Climate](https://codeclimate.com/github/ronelliott/reflekt/badges/gpa.svg)](https://codeclimate.com/github/ronelliott/reflekt)


## Overview

reflekt can call functions and construct new object, injecting any arguments required. This is achieved by converting
the function to a string and using regex to parse out the arguments. Each argument is then resolved using a defined
resolver, which can either be an object containing key/value pairs of names and values to pass, or a function which
takes the name of the argument as a parameter and returns the argument to pass.


## Installation
Install using [NPM](https://github.com/isaacs/npm):

    npm install reflekt --save


## Examples / Quickstart

This covers the basic usage of reflekt, for more detailed information consult the API section below.

NOTE: for brevity's sake, all examples should be assumed to begin with: 

```js
var reflekt = require('reflekt');

function myFunc(foo, bar) {
    console.log('foo', foo);
    console.log('bar', bar);
}

function myOtherFunc(foo, bar) {
    console.log('foo', foo);
    console.log('bar', bar);
}

function MyClass(foo, bar) {
    console.log('foo', foo);
    console.log('bar', bar);
}

MyClass.prototype = {
    something: function(name) {
        console.log('name', name || 'stan');
    }
};

function MyOtherClass(foo, bar) {
    console.log('foo', foo);
    console.log('bar', bar);
}

MyOtherClass.prototype = {
    something: function(name) {
        console.log('name', name || 'smith');
    }
};
```


### Calling a Function

code:

```js
reflekt.call(myFunc, { foo: 'duck', bar: 'sauce' });
```

output:

```bash
foo duck
bar sauce
```

### Calling a Function Using the Resolver

code:

```js
reflekt.call('myFunc', { myFunc: myFunc, foo: 'duck', bar: 'sauce' });
```

output:

```bash
foo duck
bar sauce
```

#### Calling a Function and Overriding Argument Names

code:

```js
reflekt.call([ 'bar', 'bar', myFunc ], { bar: 'ducks' });
```

output:

```bash
foo ducks
bar ducks
```

### Calling Multiple Functions Using the Same Resolver

code:

```js
var myCaller = reflekt.caller({ foo: 'duck', bar: 'sauce' });
myCaller(myFunc);
myCaller(myOtherFunc);
```

output:

```bash
foo duck
bar sauce
foo duck
bar sauce
```

### Constructing an Object

code:

```js
var myInstance = reflekt.construct(MyClass, { foo: 'duck', bar: 'sauce' });
console.log(myInstance instanceof MyClass);
myInstance.something();
```

output:

```bash
foo duck
bar sauce
true
name stan
```

### Constructing an Object Using the Resolver

code:

```js
var myInstance = reflekt.construct('MyClass', { MyClass: MyClass, foo: 'duck', bar: 'sauce' });
```

output:

```bash
foo duck
bar sauce
```

### Constructing Multiple Objects with the Same Resolver

code:

```js
var myConstructor = reflekt.constructor({ foo: 'duck', bar: 'sauce' });
var myInstance = myConstructor(MyClass);
var myOtherInstance = myConstructor(MyOtherClass);
```

output:

```bash
foo duck
bar sauce
foo duck
bar sauce
```

### Constructing the Same Object Multiple Times Using the Resolver

code:

```js
var myConstructor = reflekt.constructor({ MyClass: MyClass, foo: 'duck', bar: 'sauce' });
var myInstance = myConstructor('MyClass');
var myOtherInstance = myConstructor('MyClass');
```

output:

```bash
foo duck
bar sauce
foo duck
bar sauce
```


# API Reference
<a name="module_reflekt"></a>

## reflekt

* [reflekt](#module_reflekt)
    * [.ObjectResolver()](#module_reflekt.ObjectResolver) ⇒ <code>function</code>
        * [~resolve(name)](#module_reflekt.ObjectResolver..resolve) ⇒ <code>Object</code> &#124; <code>undefined</code>
        * [~add(name, [value], [lifetime])](#module_reflekt.ObjectResolver..add)
        * [~get(name)](#module_reflekt.ObjectResolver..get) ⇒ <code>Object</code> &#124; <code>undefined</code>
        * [~has(name)](#module_reflekt.ObjectResolver..has) ⇒ <code>Boolean</code>
        * [~remove(name)](#module_reflekt.ObjectResolver..remove)
        * [~set(name, [value], [lifetime])](#module_reflekt.ObjectResolver..set)
    * [.any(items, callback)](#module_reflekt.any) ⇒ <code>Boolean</code>
    * [.call(fn, [resolver], [context])](#module_reflekt.call) ⇒ <code>Object</code>
    * [.caller([resolver])](#module_reflekt.caller) ⇒ <code>function</code>
    * [.construct(klass, [resolver], [context])](#module_reflekt.construct) ⇒ <code>Object</code>
    * [.constructor([resolver])](#module_reflekt.constructor) ⇒ <code>function</code>
    * [.decorate(fn, [resolver], [context])](#module_reflekt.decorate) ⇒ <code>Object</code>
    * [.every(items, callback)](#module_reflekt.every) ⇒ <code>Boolean</code>
    * [.has(fn, args, [allOrNone])](#module_reflekt.has) ⇒ <code>Boolean</code>
    * [.injections(fn, [resolver])](#module_reflekt.injections) ⇒ <code>Array</code>
    * [.isKind(item, kind)](#module_reflekt.isKind) ⇒ <code>Boolean</code>
    * [.isArray(item)](#module_reflekt.isArray) ⇒ <code>Boolean</code>
    * [.isBoolean(item)](#module_reflekt.isBoolean) ⇒ <code>Boolean</code>
    * [.isObject(item)](#module_reflekt.isObject) ⇒ <code>Boolean</code>
    * [.isString(item)](#module_reflekt.isString) ⇒ <code>Boolean</code>
    * [.parse(fn)](#module_reflekt.parse) ⇒ <code>Array</code>

<a name="module_reflekt.ObjectResolver"></a>

### reflekt.ObjectResolver() ⇒ <code>function</code>
creates a new ObjectResolver

**Kind**: static method of <code>[reflekt](#module_reflekt)</code>  
**Returns**: <code>function</code> - the created ObjectResolver. see [ObjectResolver~resolve](ObjectResolver~resolve).  
**Params**: <code>Object</code> [items] - the items to initially store when creating the ObjectResolver  

* [.ObjectResolver()](#module_reflekt.ObjectResolver) ⇒ <code>function</code>
    * [~resolve(name)](#module_reflekt.ObjectResolver..resolve) ⇒ <code>Object</code> &#124; <code>undefined</code>
    * [~add(name, [value], [lifetime])](#module_reflekt.ObjectResolver..add)
    * [~get(name)](#module_reflekt.ObjectResolver..get) ⇒ <code>Object</code> &#124; <code>undefined</code>
    * [~has(name)](#module_reflekt.ObjectResolver..has) ⇒ <code>Boolean</code>
    * [~remove(name)](#module_reflekt.ObjectResolver..remove)
    * [~set(name, [value], [lifetime])](#module_reflekt.ObjectResolver..set)

<a name="module_reflekt.ObjectResolver..resolve"></a>

#### ObjectResolver~resolve(name) ⇒ <code>Object</code> &#124; <code>undefined</code>
attempts to resolve an item with the given name.

     NOTE: the ObjectResolver is callable directly, which is an alias to this function.

**Kind**: inner method of <code>[ObjectResolver](#module_reflekt.ObjectResolver)</code>  
**Returns**: <code>Object</code> &#124; <code>undefined</code> - the resolved item, or undefined if it was not found  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the name of the item to add |

<a name="module_reflekt.ObjectResolver..add"></a>

#### ObjectResolver~add(name, [value], [lifetime])
adds an item using the given name, value and lifetime

**Kind**: inner method of <code>[ObjectResolver](#module_reflekt.ObjectResolver)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Object</code> | the name of the item to add. if an object is passed all items will be added |
| [value] | <code>Object</code> | the value of the item to store |
| [lifetime] | <code>Integer</code> | how many times the item can be resolved before being removed automatically |

<a name="module_reflekt.ObjectResolver..get"></a>

#### ObjectResolver~get(name) ⇒ <code>Object</code> &#124; <code>undefined</code>
attempts to resolve an item with the given name.

     NOTE: the ObjectResolver is callable directly, which is an alias to this function.

**Kind**: inner method of <code>[ObjectResolver](#module_reflekt.ObjectResolver)</code>  
**Returns**: <code>Object</code> &#124; <code>undefined</code> - the resolved item, or undefined if it was not found  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the name of the item to add |

<a name="module_reflekt.ObjectResolver..has"></a>

#### ObjectResolver~has(name) ⇒ <code>Boolean</code>
checks if the item exists in the resolver

**Kind**: inner method of <code>[ObjectResolver](#module_reflekt.ObjectResolver)</code>  
**Returns**: <code>Boolean</code> - true if the ObjectResolver has the item, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the name of the item to check |

<a name="module_reflekt.ObjectResolver..remove"></a>

#### ObjectResolver~remove(name)
removes an item with the given name from the ObjectResolver

**Kind**: inner method of <code>[ObjectResolver](#module_reflekt.ObjectResolver)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Array</code> | the name(s) of the item to remove |

<a name="module_reflekt.ObjectResolver..set"></a>

#### ObjectResolver~set(name, [value], [lifetime])
adds an item using the given name, value and lifetime

**Kind**: inner method of <code>[ObjectResolver](#module_reflekt.ObjectResolver)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Object</code> | the name of the item to add. if an object is passed all items will be added |
| [value] | <code>Object</code> | the value of the item to store |
| [lifetime] | <code>Integer</code> | how many times the item can be resolved before being removed automatically |

<a name="module_reflekt.any"></a>

### reflekt.any(items, callback) ⇒ <code>Boolean</code>
calls the callback on each item in the array, stopping when the first callback
 returns true

**Kind**: static method of <code>[reflekt](#module_reflekt)</code>  
**Returns**: <code>Boolean</code> - true if any calls return true, or false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| items | <code>Array</code> | the items to call the callback with |
| callback | <code>function</code> | the function to call with each item |

<a name="module_reflekt.call"></a>

### reflekt.call(fn, [resolver], [context]) ⇒ <code>Object</code>
calls the function using the given resolver and context

**Kind**: static method of <code>[reflekt](#module_reflekt)</code>  
**Returns**: <code>Object</code> - the result of the function call  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> &#124; <code>String</code> &#124; <code>Array</code> | the function to call |
| [resolver] | <code>function</code> &#124; <code>Object</code> | the resolver to use to resolve the function's arguments |
| [context] | <code>Object</code> | the context to call the function in |

<a name="module_reflekt.caller"></a>

### reflekt.caller([resolver]) ⇒ <code>function</code>
creates a function that takes a function/string and a context, calling the function in the given context using the
 given resolver

**Kind**: static method of <code>[reflekt](#module_reflekt)</code>  
**Returns**: <code>function</code> - the function that calls other functions  

| Param | Type | Description |
| --- | --- | --- |
| [resolver] | <code>function</code> &#124; <code>Object</code> &#124; <code>Array</code> | the resolver to use to resolve the function's arguments |

<a name="module_reflekt.construct"></a>

### reflekt.construct(klass, [resolver], [context]) ⇒ <code>Object</code>
constructs a new copy of the given klass using the given resolver and context

**Kind**: static method of <code>[reflekt](#module_reflekt)</code>  
**Returns**: <code>Object</code> - the result of the call to the class constructor  

| Param | Type | Description |
| --- | --- | --- |
| klass | <code>function</code> &#124; <code>String</code> | the object to construct a new copy of |
| [resolver] | <code>function</code> &#124; <code>Object</code> &#124; <code>Array</code> | the resolver to use to resolve the class constructor's arguments |
| [context] | <code>Object</code> | the context to call the class constructor in |

<a name="module_reflekt.constructor"></a>

### reflekt.constructor([resolver]) ⇒ <code>function</code>
creates a function that takes a class and context, creating a new copy of the class in the given context using the
 given resolver

**Kind**: static method of <code>[reflekt](#module_reflekt)</code>  
**Returns**: <code>function</code> - the function that constructs other objects  

| Param | Type | Description |
| --- | --- | --- |
| [resolver] | <code>function</code> &#124; <code>Object</code> &#124; <code>Array</code> | the resolver to use to resolve the class constructor's arguments |

<a name="module_reflekt.decorate"></a>

### reflekt.decorate(fn, [resolver], [context]) ⇒ <code>Object</code>
creates a function that calls the given function using the given resolver in the given context

**Kind**: static method of <code>[reflekt](#module_reflekt)</code>  
**Returns**: <code>Object</code> - a function that takes no arguments and returns the result of calling the given function  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> &#124; <code>String</code> | the function to resolve the arguments for |
| [resolver] | <code>function</code> &#124; <code>Object</code> &#124; <code>Array</code> | the resolver to use to resolve the function's arguments |
| [context] | <code>Object</code> | the context to call the function in |

<a name="module_reflekt.every"></a>

### reflekt.every(items, callback) ⇒ <code>Boolean</code>
calls the callback on each item in the array

**Kind**: static method of <code>[reflekt](#module_reflekt)</code>  
**Returns**: <code>Boolean</code> - true if all calls return true, or false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| items | <code>Array</code> | the items to call the callback with |
| callback | <code>function</code> | the function to call with each item |

<a name="module_reflekt.has"></a>

### reflekt.has(fn, args, [allOrNone]) ⇒ <code>Boolean</code>
checks if the given function has the given argument(s)

**Kind**: static method of <code>[reflekt](#module_reflekt)</code>  
**Returns**: <code>Boolean</code> - true if the argument(s) are found in the function signature, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | the function to check |
| args | <code>String</code> &#124; <code>Array</code> | the args to check |
| [allOrNone] | <code>Boolean</code> | if true, all args given must be present. if false, any of the args may be present.  the default is true. |

<a name="module_reflekt.injections"></a>

### reflekt.injections(fn, [resolver]) ⇒ <code>Array</code>
resolves the function's arguments using the given resolver

**Kind**: static method of <code>[reflekt](#module_reflekt)</code>  
**Returns**: <code>Array</code> - the functions resolved arguments, in order of appearance in the function's signature  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> &#124; <code>String</code> &#124; <code>Array</code> | the function to resolve the arguments for |
| [resolver] | <code>function</code> &#124; <code>Object</code> &#124; <code>Array</code> | the resolver(s) to use to resolve the function's arguments |

<a name="module_reflekt.isKind"></a>

### reflekt.isKind(item, kind) ⇒ <code>Boolean</code>
checks if the given item is of the given type by calling `Object.toString` on the item and doing an comparison between
 the result and the given kind

**Kind**: static method of <code>[reflekt](#module_reflekt)</code>  
**Returns**: <code>Boolean</code> - true if the item is of the same type, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>Object</code> | the item to check the type of |
| kind | <code>String</code> | the type expected, in the form of '[object Object]' |

<a name="module_reflekt.isArray"></a>

### reflekt.isArray(item) ⇒ <code>Boolean</code>
checks if the given item is an array

**Kind**: static method of <code>[reflekt](#module_reflekt)</code>  
**Returns**: <code>Boolean</code> - true if the item is an array, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>Object</code> | the item to check the type of |

<a name="module_reflekt.isBoolean"></a>

### reflekt.isBoolean(item) ⇒ <code>Boolean</code>
checks if the given item is a boolean

**Kind**: static method of <code>[reflekt](#module_reflekt)</code>  
**Returns**: <code>Boolean</code> - true if the item is a boolean, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>Object</code> | the item to check the type of |

<a name="module_reflekt.isObject"></a>

### reflekt.isObject(item) ⇒ <code>Boolean</code>
checks if the given item is an object

**Kind**: static method of <code>[reflekt](#module_reflekt)</code>  
**Returns**: <code>Boolean</code> - true if the item is an object, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>Object</code> | the item to check the type of |

<a name="module_reflekt.isString"></a>

### reflekt.isString(item) ⇒ <code>Boolean</code>
checks if the given item is a string

**Kind**: static method of <code>[reflekt](#module_reflekt)</code>  
**Returns**: <code>Boolean</code> - true if the item is a string, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>Object</code> | the item to check the type of |

<a name="module_reflekt.parse"></a>

### reflekt.parse(fn) ⇒ <code>Array</code>
parses the function's arguments, returning an array of the arguments found

**Kind**: static method of <code>[reflekt](#module_reflekt)</code>  
**Returns**: <code>Array</code> - the functions arguments, in order of appearance in the function's signature  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> &#124; <code>String</code> | the function to parse the arguments for |


[![Analytics](https://ga-beacon.appspot.com/UA-59523757-2/reflekt/readme?pixel)](https://github.com/igrigorik/ga-beacon)
