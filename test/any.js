'use strict';

var should = require('should'),
    reflekt = require('../reflekt');

describe('any', function() {
    function check(item) {
        return item;
    }

    it('should return true if all elements are true', function() {
        var items = [ true, true, true ];
        reflekt.any(items, check).should.equal(true);
    });

    it('should return true if at least one element is true', function() {
        var items = [ true, false, true ];
        reflekt.any(items, check).should.equal(true);
    });

    it('should return false if all items are false', function() {
        var items = [ false, false, false ];
        reflekt.any(items, check).should.equal(false);
    });
});
