# reflekt
[![Build Status](https://travis-ci.org/ronelliott/reflekt.png)](https://travis-ci.org/ronelliott/reflekt)
[![NPM version](https://badge.fury.io/js/reflekt.png)](http://badge.fury.io/js/reflekt)

reflekt supports function argument injection, parsing the method signature to determine dependencies.


## Installation
Install using [NPM](https://github.com/isaacs/npm):

    npm install reflekt --save

## Quickstart

```javascript
var reflekt = require('reflekt'),
    items = { bar: 'got me a bar' },
    resolve = new reflekt.ObjectResolver(items);

function foo(bar) {
    console.log(bar);
}

reflekt.call(foo, resolve);
```

```bash
> 'got me a bar'
```

```javascript
var decorated = reflekt.decorate(foo, resolve);
decorated();
```

```bash
> 'got me a bar'
```

```javascript
decorated();
```

```bash
> 'got me a bar'
```

```javascript
var caller = reflekt.caller(resolve);
caller(foo);
```

```bash
> 'got me a bar'
```

