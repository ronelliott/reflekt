'use strict';

var should = require('should'),
    reflekt = require('../reflekt');

describe('every', function() {
    function check(item) {
        return item;
    }

    it('should return true if all elements are true', function() {
        var items = [ true, true, true ];
        reflekt.every(items, check).should.equal(true);
    });

    it('should return false if at least one element is false', function() {
        var items = [ true, false, true ];
        reflekt.every(items, check).should.equal(false);
    });
});
