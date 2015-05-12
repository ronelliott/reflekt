'use strict';

var should = require('should'),
    ObjectResolver = require('../reflekt').ObjectResolver;

describe('ObjectResolver', function() {
    beforeEach(function() {
        this.resolver = new ObjectResolver({ foo: 'bar' });
    });

    it('should resolve items found', function() {
        this.resolver('foo').should.equal('bar');
    });

    it('should not resolve items not found', function() {
        should(this.resolver('bar')).not.be.ok;
    });
});
