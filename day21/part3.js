var R = require('ramda');
var debug = x => { debugger; return x; };

var tryParseInt = x => isNaN(parseInt(x)) ? x : parseInt(x);
var lineRegex = /(\w+) (\d+) (\d+) (\d+)/;
var parseLine = R.pipe(R.match(lineRegex), R.tail, R.map(tryParseInt), R.zipObj(['op', 'a', 'b', 'c']));
var parseInput = R.pipe(R.trim, R.split('\n'), R.tail, R.map(parseLine));

var parseIp = R.pipe(R.trim, R.split('\n'), R.head, R.split(' '), R.tail, R.head, parseInt);

var chars = ['input', 'i', 'a', 'b', 'c', 'd'];
var char = x => chars[x];
var ops = {
    'addr': (inst) => `${char(inst.c)} = ${char(inst.a)} + ${char(inst.b)};`,
    'addi': (inst) => `${char(inst.c)} = ${char(inst.a)} + ${inst.b};`,
    'mulr': (inst) => `${char(inst.c)} = ${char(inst.a)} * ${char(inst.b)};`,
    'muli': (inst) => `${char(inst.c)} = ${char(inst.a)} * ${inst.b};`,
    'banr': (inst) => `${char(inst.c)} = ${char(inst.a)} & ${char(inst.b)};`,
    'bani': (inst) => `${char(inst.c)} = ${char(inst.a)} & ${inst.b};`,
    'borr': (inst) => `${char(inst.c)} = ${char(inst.a)} | ${char(inst.b)};`,
    'bori': (inst) => `${char(inst.c)} = ${char(inst.a)} | ${inst.b};`,
    'setr': (inst) => `${char(inst.c)} = ${char(inst.a)};`,
    'seti': (inst) => `${char(inst.c)} = ${inst.a};`,
    'gtir': (inst) => `${char(inst.c)} = ${inst.a} > ${char(inst.b)} ? 1 : 0;`,
    'gtri': (inst) => `${char(inst.c)} = ${char(inst.a)} > ${inst.b} ? 1 : 0;`,
    'gtrr': (inst) => `${char(inst.c)} = ${char(inst.a)} > ${char(inst.b)} ? 1 : 0;`,
    'eqir': (inst) => `${char(inst.c)} = ${inst.a} === ${char(inst.b)} ? 1 : 0;`,
    'eqri': (inst) => `${char(inst.c)} = ${char(inst.a)} === ${inst.b} ? 1 : 0;`,
    'eqrr': (inst) => `${char(inst.c)} = ${char(inst.a)} === ${char(inst.b)} ? 1 : 0;`,
};

var run = input => {
    var binding = parseIp(input);
    var prog = parseInput(input);
    var regs = R.repeat(0, 6);
    
    for(var line of prog) {
        console.log(ops[line.op](line));
    }
};

var solution = R.pipe(run);

module.exports = solution;