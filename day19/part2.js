var R = require('ramda');
var debug = x => { debugger; return x; };

var tryParseInt = x => isNaN(parseInt(x)) ? x : parseInt(x);
var lineRegex = /(\w+) (\d+) (\d+) (\d+)/;
var parseLine = R.pipe(R.match(lineRegex), R.tail, R.map(tryParseInt), R.zipObj(['op', 'a', 'b', 'c']));
var parseInput = R.pipe(R.trim, R.split('\n'), R.tail, R.map(parseLine));

var parseIp = R.pipe(R.trim, R.split('\n'), R.head, R.split(' '), R.tail, R.head, parseInt);

var ops = {
    'addr': (regs, inst) => {
        regs[inst.c] = regs[inst.a] + regs[inst.b];
    },
    'addi': (regs, inst) => {
        regs[inst.c] = regs[inst.a] + inst.b;
    },
    'mulr': (regs, inst) => {
        regs[inst.c] = regs[inst.a] * regs[inst.b];
    },
    'muli': (regs, inst) => {
        regs[inst.c] = regs[inst.a] * inst.b;
    },
    'banr': (regs, inst) => {
        regs[inst.c] = regs[inst.a] & regs[inst.b];
    },
    'bani': (regs, inst) => {
        regs[inst.c] = regs[inst.a] & inst.b;
    },
    'borr': (regs, inst) => {
        regs[inst.c] = regs[inst.a] | regs[inst.b];
    },
    'bori': (regs, inst) => {
        regs[inst.c] = regs[inst.a] | inst.b;
    },
    'setr': (regs, inst) => {
        regs[inst.c] = regs[inst.a];
    },
    'seti': (regs, inst) => {
        regs[inst.c] = inst.a;
    },
    'gtir': (regs, inst) => {
        regs[inst.c] = inst.a > regs[inst.b] ? 1 : 0;
    },
    'gtri': (regs, inst) => {
        regs[inst.c] = regs[inst.a] > inst.b ? 1 : 0;
    },
    'gtrr': (regs, inst) => {
        regs[inst.c] = regs[inst.a] > regs[inst.b] ? 1 : 0;
    },
    'eqir': (regs, inst) => {
        regs[inst.c] = inst.a === regs[inst.b] ? 1 : 0;
    },
    'eqri': (regs, inst) => {
        regs[inst.c] = regs[inst.a] === inst.b ? 1 : 0;
    },
    'eqrr': (regs, inst) => {
        regs[inst.c] = regs[inst.a] === regs[inst.b] ? 1 : 0;
    },
};

var run = input => {
    var binding = parseIp(input);
    var prog = parseInput(input);
    var regs = R.repeat(0, 6);
    //regs[0] = 1;

    var i = 0;
    var j = 0;
    while(true) {
        // if (regs[1] === regs[5]) debugger;
        regs[binding] = i;
        var inst = prog[i];
        if (!inst) break;
        ops[inst.op](regs, inst);
        i = regs[binding];
        i++;
        j++
        if (inst.c === 0) {
            console.log(regs);
        }
    }

    return regs[0];
};

var solution = R.pipe(run);

module.exports = solution;