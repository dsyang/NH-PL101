var PEG = require('pegjs');
var assert = require('assert');
var util = require('util');
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync('syntax.peg', 'utf-8');
//unlimited depth printing
var inspect = function (x) {console.log(util.inspect(x, false, null))};

// Show the PEG grammar file
console.log(data);


// Create my parser
var parse = PEG.buildParser(data).parse;



// Do a test
assert.deepEqual( parse("(a b c)"), ["a", "b", "c"] );
console.log(parse("asdfasdfasdf"));

var fact = 
          "(defun fact (x)\n"
        + "  ;; the factorial function fact 4 ==> 4*3*2*1 \n"
        + "  (case x (1? (return 1))\n"
        + "          (_? (return (* x (fact x-1)))))\n"
        + ")";

console.log(fact);
inspect(parse(fact));
assert.deepEqual( parse(fact), [ 'defun', 'fact', [ 'x' ], 
                                 [ 'case', 'x',
                                   [ '1?', [ 'return', '1' ] ],
                                   [ '_?', [ 'return', [ '*', 'x', [ 'fact', 'x-1' ] ] ] ]
                                 ] ]);
var qq = 
          "(let ( \n"
        + "      (x '(a b c d e)) \n"
        + "      (y (quote x)) \n"
        + "     )\n"
        + "     (concat x y)\n"
        + ")";

console.log(qq);
inspect(parse(qq));
assert.deepEqual(parse(qq), [ 'let',
                              [ [ 'x', [ 'quote', [ 'a', 'b', 'c', 'd', 'e' ] ] ],
                                [ 'y', [ 'quote', 'x' ] ] ],
                              [ 'concat', 'x', 'y' ] ]);