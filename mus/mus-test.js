var PEG = require('pegjs');
var assert = require('assert');
var util = require('util');
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync('mus.peg', 'utf-8');
//unlimited depth printing
var inspect = function (x) {console.log(util.inspect(x, false, null))};
var assertEqual = function(x,y) {assert.deepEqual(x,y);};
// Show the PEG grammar file
console.log(data);

// Create my parser
var parse = PEG.buildParser(data).parse;

var csharp = parse("c#4/4");
assertEqual(csharp, { tag: 'note', pitch: 'c#4', dur: 1000});
inspect(csharp);

var abseq = parse("[ a b ]4/4");
assertEqual(abseq, {"tag": "seq",
                     "left": {"tag": "note", "pitch": "a4", "dur": 1000},
                     "right": {"tag": "note", "pitch": "b4","dur": 1000}
                    })
inspect(abseq);

var jingle1 = parse("[c c g g a a]4/4 g4/2");
inspect(jingle1)


var temp1 = parse(":tempo 8 = 120 [c c g g a a]4/4 g4/2");
inspect(temp1)

var twinkle = parse(";; twinkle twinkle\n"
                    + ":tempo 4 = 60\n"
                    + "[c c g g a a]4/4 g4/2\n"
                    + "[f f e e d d]4/4 c4/2\n"
                    + "|: [g g f f e e]4/4 d4/2 :|\n"
                    + "[c c g g a a]4/4 g4/2\n"
                    + "[f f e e d d]4/4 <c e g>4/2\n"
                    )
inspect(twinkle)
