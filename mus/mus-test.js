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

console.log("======= Full songs! ======\n");

var jingle1 = parse("[c c g g a a]4/4 g4/2");
inspect(jingle1);


var twinkletext = (";; twinkle twinkle\n"
                    + ":tempo 4 = 60\n"
                    + "[c c g g a a]4/4 g4/2\n"
                    + "[f f e e d d]4/4 c4/2\n"
                    + "|: [g g f f e e]4/4 d4/2 :|\n"
                    + "[c c g g a a]4/4 g4/2\n"
                    + "[f f e e d d]4/4 <c e g>4/2\n"
                    )
console.log(twinkletext);
inspect(parse(twinkletext));




var csharptxt = "c#4/4";
var csharp = parse(csharptxt);
assertEqual(csharp, { tag: 'note', pitch: 'c#4', dur: 1000});
console.log("\n\nTESTING csharp:  "+csharptxt+"\n\n")
inspect(csharp);

var abseqtxt = "[ a b ]4/4";
var abseq = parse(abseqtxt);
assertEqual(abseq, {"tag": "seq",
                     "left": {"tag": "note", "pitch": "a4", "dur": 1000},
                     "right": {"tag": "note", "pitch": "b4","dur": 1000}
                    })
console.log("\n\nTESTING sequence:  "+abseqtxt+"\n\n")
inspect(abseq);


var tempotxt = ":tempo 8 = 120  a4/4  g4/2";
var tempo = parse(tempotxt);
console.log("\n\nTESTING tempo:  "+tempotxt+"\n\n")
inspect(tempo)

var repeattxt = "|: a4/4 :|";
var repeat = parse(repeattxt);
assertEqual(repeat, {tag: "repeat",
                     section: {tag: "note", pitch: "a4", dur: 1000},
                     count: 2});
console.log("\n\nTESTING repeat:  "+repeattxt+"\n\n")
inspect(repeat)
