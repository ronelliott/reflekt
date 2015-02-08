'use strict';

var extend = require('extend'),
    api = require('./api'),
    resolvers = require('./resolvers');

extend(module.exports, api, resolvers);
