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

## License
Copyright (c) 2015, Ron Elliott

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.


