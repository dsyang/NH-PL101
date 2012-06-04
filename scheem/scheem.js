/*
    Numbers
    Variable references
    begin
    quote
    =, <, cons, car, cdr
    if
*/
var evalScheem = function (expr, env) {
    var car = function (x) { return x[0]; }
    var cdr = function (x) { return x.splice(1); }
    var evalBegin = function (exprs, env) {
        if (exprs.length == 1) { return evalScheem(exprs[0], env);}
        else {
            var x = car(exprs);
            var xs = cdr(exprs);
            var r = evalScheem(x, env);
            return evalBegin(xs, r[1]);
        }
    };
    var boolCheck = function (vals) {
        for(var i=0; i<vals.length; i++) {
            if(vals[i] === '#f' || vals[i] === '#t') {}
            else {
                throw new Error('value is not boolean');
            }
        }
        return true
    }
    var typeCheck = function (vals, argnum, types, expr, argopt) {
        var typeofCheck = function(expr, types) {
            for (var i=0; i<expr.length; i++) {
                if(typeof expr[i] === types[i]) {} else {
                    throw new Error('Tycon Mismatch: expected('+(types[i])
                                    +')   got('+(typeof expr[i])+')');
                    return false
                }
            }
            return true;
        }
        //check number of args
        var argcmp = true;
        switch(argopt) {
            case 'eq': argcmp = (expr.length === (argnum+1)); break;
            case 'lt': argcmp = (expr.length < (argnum+1)); break;
            case 'gt': argcmp = (expr.length > (argnum+1)); break;
        }
        if(argcmp) {
            if(typeofCheck(vals, types)) {
                return true;
            } else { return false;}
        } else {
            throw new Error('Mismatch arg numbers: expected('+argnum+')   got('+expr.length+')');
        }
    }

    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
        return [expr, env];
    }
    //Strings are variable references
    if (typeof expr === 'string') {
        return [env[expr], env];
    }
    // Look at head of list for operation
    switch (expr[0]) {
    case '+':
        var res1 = evalScheem(expr[1], env);
        var res2 = evalScheem(expr[2], res1[1]);
        typeCheck([res1[0], res2[0]], 2, ['number', 'number'], expr, 'eq');
        return [res1[0] + res2[0], res2[1]];
    case '-':
        var res1 = evalScheem(expr[1], env);
        var res2 = evalScheem(expr[2], res1[1]);
        typeCheck([res1[0], res2[0]], 2, ['number', 'number'], expr, 'eq');
        return [res1[0] - res2[0], res2[1]];
    case '*':
        var res1 = evalScheem(expr[1], env);
        var res2 = evalScheem(expr[2], res1[1]);
        typeCheck([res1[0], res2[0]], 2, ['number', 'number'], expr, 'eq');
        return [res1[0] * res2[0], res2[1]];
    case '/':
        var res1 = evalScheem(expr[1], env);
        var res2 = evalScheem(expr[2], res1[1]);
        typeCheck([res1[0], res2[0]], 2, ['number', 'number'], expr, 'eq');
        return [res1[0] / res2[0], res2[1]];
    case 'define':
        var res =  evalScheem(expr[2], env);
        res[1][expr[1]] = res[0];
        typeCheck([expr[1]], 2, ['string'], expr, 'eq');
        return [res[0], res[1]];
    case 'set!':
        var res =  evalScheem(expr[2], env);
        res[1][expr[1]] = res[0];
        typeCheck([expr[1]], 2, ['string'], expr, 'eq');
        return [res[0], res[1]];
    case 'begin':
        typeCheck([], 1, [], expr, 'gt');
        var exprs = cdr(expr);
        return evalBegin(exprs, env);
    case 'quote':
        typeCheck([], 1, [], expr, 'eq');
        return [expr[1], env];
    case '=':
        var res1 = evalScheem(expr[1], env);
        var res2 = evalScheem(expr[2], res1[1]);
        typeCheck([res1[0], res2[0]], 2, ['number', 'number'], expr, 'eq');
        return [(res1[0] === res2[0]) ? "#t" : "#f", res2[1]];
    case '<':
        var res1 = evalScheem(expr[1], env);
        var res2 = evalScheem(expr[2], res1[1]);
        typeCheck([res1[0], res2[0]], 2, ['number', 'number'], expr, 'eq');
        return [(res1[0] < res2[0]) ? "#t" : "#f", res2[1]];
    case '>':
        var res1 = evalScheem(expr[1], env);
        var res2 = evalScheem(expr[2], res1[1]);
        typeCheck([res1[0], res2[0]], 2, ['number', 'number'], expr, 'eq');
        return [(res1[0] > res2[0]) ? "#t" : "#f", res2[1]];
    case 'if':
        var res1 = evalScheem(expr[1], env);
        typeCheck([res1[0]], 3, ['string'], expr, 'eq');
        boolCheck([res1[0]]);
        switch(res1[0]) {
            case '#t': return evalScheem(expr[2], res1[1]);
            case '#f': return evalScheem(expr[3], res1[1]);
        }
    case 'cons':
        var res1 = evalScheem(expr[1], env);
        var res2 = evalScheem(expr[2], res1[1]);
        typeCheck([res2[0]], 2, ['object'], expr, 'eq');
      return [[res1[0]].concat(res2[0]), res2[1]];
    case 'car':
        var res = evalScheem(expr[1], env);
        typeCheck([], 1, [], expr, 'eq');
        return [res[0][0], res[1]];
    case 'cdr':
        var res = evalScheem(expr[1], env);
        typeCheck([res[0]], 1, ['object'], expr, 'eq');
        return [res[0].splice(1), res[1]];
    }
};