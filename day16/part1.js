var R = require('ramda');
var debug = x => { debugger; return x; };

var lineRegex = /Before: \[(\d+), (\d+), (\d+), (\d+)\]\r\n(\d+) (\d+) (\d+) (\d+)\r\nAfter:  \[(\d+), (\d+), (\d+), (\d+)\]/;
var parseLine = R.pipe(R.trim, R.match(lineRegex), R.tail, R.map(parseInt), R.splitEvery(4), R.zipObj(['before', 'inst', 'after']), R.evolve({'inst': R.zipObj(['op', 'a', 'b', 'c'])}));
var parseInput = R.pipe(R.trim, R.split('\n\r\n\r\n\r'), R.head, R.split('\n\r'), R.map(parseLine));

var sumBooleans = R.pipe(R.map(x => x ? 1 : 0), R.sum);

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

var behavesLikeOpCode = R.curry((sample, op) => {
    var regs = Array.from(sample.before);
    op(regs, sample.inst);
    return R.all(R.apply(R.equals), R.zip(regs, sample.after));
});

var allOpsForSample = sample => R.map(behavesLikeOpCode(sample), R.values(ops));
var behavesLikeThreeOrMoreOpCodes = R.pipe(allOpsForSample, sumBooleans, x => x >= 3);

var solution = R.pipe(parseInput, R.map(behavesLikeThreeOrMoreOpCodes), sumBooleans);

module.exports = solution;