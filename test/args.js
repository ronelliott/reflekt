'use strict';

var should = require('should'),
    args = require('../reflekt').args;

describe('args', function() {
    it('should parse a signature with a single function parameter', function() {
        function foo(bar) {}
        args(foo).should.eql([ 'bar' ]);
    });

    it('should parse a signature with a single function parameter and newlines', function() {
        function foo(

            bar) {}

        function bar(
            bar



        ) {}

        args(foo).should.eql([ 'bar' ]);
        args(bar).should.eql([ 'bar' ]);
    });

    it('should parse a signature with a single function parameter with comments', function() {
        function foo(/** Far */bar) {}
        args(foo).should.eql([ 'bar' ]);
    });

    it('should parse a signature with a single function parameter and newlines with comments', function() {
        function foo(

            /** Far */bar) {}

        function bar(
            /** Far */bar



        ) {}

        args(foo).should.eql([ 'bar' ]);
        args(bar).should.eql([ 'bar' ]);
    });

    it('should parse a signature with multiple function parameters', function() {
        function foo(bar, far) {}
        args(foo).should.eql([ 'bar', 'far' ]);
    });

    it('should parse a signature with multiple function parameters and newlines', function() {
        function foo(

            bar, far) {}

        function bar(
            bar



            ,




                                far



        ) {}

        args(foo).should.eql([ 'bar', 'far' ]);
        args(bar).should.eql([ 'bar', 'far' ]);
    });

    it('should parse a signature with multiple function parameters with comments', function() {
        function foo(bar, far) {}
        args(foo).should.eql([ 'bar', 'far' ]);
    });

    it('should parse a signature with multiple function parameters and newlines with comments', function() {
        function foo(

            /** Far */bar, /** Dar */far) {}

        function bar(
            /** Far */bar



            ,




                                    /** Dar */far



        ) {}

        args(foo).should.eql([ 'bar', 'far' ]);
        args(bar).should.eql([ 'bar', 'far' ]);
    });
});
