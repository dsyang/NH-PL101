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

assertEqual(csharp, { tag: 'note', pitch: 'c#4', dur: 15000});
inspect(csharp);