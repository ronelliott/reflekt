'use strict';

function ObjectResolver(items) {
    return function resolve(name) {
        return items[name];
    };
}

module.exports = {
    ObjectResolver: ObjectResolver,
};
