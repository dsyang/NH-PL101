
var endTime = function (time, expr) {

    if (expr.tag === 'note') {
        time += expr.dur;
    } else if (expr.tag === 'seq') {
        time += endTime(0,expr.left) + endTime(0,expr.right);
    } else if (expr.tag === 'par'){
        /* par */
        time += Math.max(endTime(0,expr.left),
                         endTime(0,expr.right));
    } else if (expr.tag === 'rest'){
        time += expr.dur;
    } else if (expr.tag === 'repeat'){
        time += endTime(0,expr.section);
    }

    return time;
};
/* midi letter pitches array */
var mlp = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11};
var convertPitch = function (p) {
    var letter = p[0];
    var octave = parseInt(p[1]);
    return (12 + 12*octave + mlp[letter]);
}

var compile_h = function (time, e) {
    if(e.tag === 'note') {
        return [{tag: 'note', pitch: convertPitch(e.pitch),
                 start: time, dur: e.dur}];
    } else if(e.tag === 'seq') {
        return compile_h(time, e.left).concat(
            compile_h(endTime(time,e.left),e.right));
    } else if(e.tag === 'par'){
        return compile_h(time, e.left).concat(
            compile_h(time,e.right));
    } else if(e.tag === 'rest'){
        return [{tag: 'rest', start: time, dur: e.dur}];
    } else if(e.tag === 'repeat'){
        if(e.count === 0) {
            return [];
        } else {
            var newe = {tag: e.tag, section: e.section, count: e.count - 1};
            return compile_h(time, e.section).concat(
                compile_h(endTime(time,e.section), newe));
        }
    } else {
        console.log ("FAIL unknown tag: " + e.tag + '\n');
        return [];
    }

};


var compile = function (musexpr) {
    return compile_h(0,musexpr);
};


var melody_mus =
    { tag: 'seq',
      left:
      { tag: 'seq',
        left: { tag: 'note', pitch: 'a4', dur: 250 },
        right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
      { tag: 'seq',
        left: { tag: 'note', pitch: 'c4', dur: 500 },
        right: { tag: 'note', pitch: 'd4', dur: 500 } } };

var melody_rest = {tag: 'seq', left: melody_mus, right: {tag: 'rest', dur: 500}};

var rest_rep3 = {tag: 'repeat', section: {tag: 'rest', dur: 200}, count: 3};

var combo = function (exp1, exp2) {
    return {tag: 'seq', left: exp1, right: exp2};
};

var test_out= function (expr) {
    console.log("===================");
    console.log(expr);
    console.log(compile(expr));
};

test_out(melody_mus);
test_out(melody_rest);
test_out(rest_rep3);
test_out(combo(melody_mus, rest_rep3));
