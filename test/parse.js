'use strict';

var should = require('should'),
    parse = require('../reflekt').parse;

describe('parse', function() {
    it('should throw an error if the given function is not defined', function() {
        (function() {
            parse();
        }).should.throw('Function is not defined!');
    });

    it('should parse a signature with a single function parameter', function() {
        function foo(bar) {}
        parse(foo).should.eql([ 'bar' ]);
    });

    it('should parse a signature with a single function parameter and newlines', function() {
        function foo(

            bar) {}

        function bar(
            bar



        ) {}

        parse(foo).should.eql([ 'bar' ]);
        parse(bar).should.eql([ 'bar' ]);
    });

    it('should parse a signature with a single function parameter with comments', function() {
        function foo(/** Far */bar) {}
        parse(foo).should.eql([ 'bar' ]);
    });

    it('should parse a signature with a single function parameter and newlines with comments', function() {
        function foo(

            /** Far */bar) {}

        function bar(
            /** Far */bar



        ) {}

        parse(foo).should.eql([ 'bar' ]);
        parse(bar).should.eql([ 'bar' ]);
    });

    it('should parse a signature with multiple function parameters', function() {
        function foo(bar, far) {}
        parse(foo).should.eql([ 'bar', 'far' ]);
    });

    it('should parse a signature with multiple function parameters and newlines', function() {
        function foo(

            bar, far) {}

        function bar(
            bar



            ,




                                far



        ) {}

        parse(foo).should.eql([ 'bar', 'far' ]);
        parse(bar).should.eql([ 'bar', 'far' ]);
    });

    it('should parse a signature with multiple function parameters with comments', function() {
        function foo(bar, far) {}
        parse(foo).should.eql([ 'bar', 'far' ]);
    });

    it('should parse a signature with multiple function parameters and newlines with comments', function() {
        function foo(

            /** Far */bar, /** Dar */far) {}

        function bar(
            /** Far */bar



            ,




                                    /** Dar */far



        ) {}

        parse(foo).should.eql([ 'bar', 'far' ]);
        parse(bar).should.eql([ 'bar', 'far' ]);
    });
});
