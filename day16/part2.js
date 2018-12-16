var R = require('ramda');

var sampleRegex = /Before: \[(\d+), (\d+), (\d+), (\d+)\]\r\n(\d+) (\d+) (\d+) (\d+)\r\nAfter:  \[(\d+), (\d+), (\d+), (\d+)\]/;
var parseSample = R.pipe(R.trim, R.match(sampleRegex), R.tail, R.map(parseInt), R.splitEvery(4), R.zipObj(['before', 'inst', 'after']), R.evolve({'inst': R.zipObj(['code', 'a', 'b', 'c'])}));
var parseSamples = R.pipe(R.trim, R.split('\n\r\n\r\n\r'), R.head, R.split('\n\r'), R.map(parseSample));

var parseLine = R.pipe(R.split(' '), R.map(parseInt), R.zipObj(['code', 'a', 'b', 'c']));
var parseProgram = R.pipe(R.trim, R.split('\n\r\n\r\n\r'), R.last, R.trim, R.split('\n'), R.map(parseLine));

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
var arraysMatch = (a, b) => R.all(R.apply(R.equals), R.zip(a, b));

var behavesLikeOpCode = R.curry((sample, op) => {
    if (!op) return false;
    var regs = Array.from(sample.before);
    op(regs, sample.inst);
    return arraysMatch(regs, sample.after);
});

var allOpsForSample = (sample, opsArray) => R.map(behavesLikeOpCode(sample), opsArray);

var runProgram = (program, codes) => {
    var regs = [0, 0, 0, 0];
    for(var inst of program) {
        var op = codes[inst.code];
        op(regs, inst);
    }

    return regs;
}

var run = input => {
    var samples = parseSamples(input);
    var program = parseProgram(input);
    var unknownOps = R.values(ops);
    var knownOps = [];

    while(R.any(x => x !== null, unknownOps)) {
        for(var sample of samples) {
            var behaviors = allOpsForSample(sample, unknownOps);
            if (sumBooleans(behaviors) === 1) {
                var i = R.findIndex(R.identity, behaviors);
                knownOps[sample.inst.code] = unknownOps[i];
                unknownOps[i] = null;
            }
        }
    }

    return R.head(runProgram(program, knownOps));
}

var solution = R.pipe(run);

module.exports = solution;