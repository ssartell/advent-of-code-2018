var R = require('ramda');
var helpers = require('mnemonist/set');
var Heap = require('mnemonist/heap');

var lineRegex = /Step (.) must be finished before step (.) can begin./;
var parseLine = R.pipe(R.match(lineRegex), R.tail, R.zipObj(['l', 'r']));
var parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseLine));

var addToMap = (map, a, b) => {
    if (map.has(a)) {
        map.get(a).add(b);
    } else {
        map.set(a, new Set([b]));
    }
}

var solve = instructions => {
    var left = new Set();
    var right = new Set();
    var leftToRight = new Map();
    var rightToLeft = new Map();

    for(var inst of instructions) {
        left.add(inst.l);
        right.add(inst.r);
        addToMap(leftToRight, inst.l, inst.r);
        addToMap(rightToLeft, inst.r, inst.l);
    }
    
    var workBeingDone = Heap.from(helpers.difference(left, right), R.comparator((a, b) => a < b));
    var steps = '';
    while(workBeingDone.peek()) {
        var step = workBeingDone.pop();
        steps += step;
        var rights = leftToRight.get(step);
        leftToRight.delete(step);

        if (!rights) continue;
        for(var right of rights) {
            var lefts = rightToLeft.get(right);
            lefts.delete(step);
            if (lefts.size === 0) {
                workBeingDone.push(right);
            }
        }
    }
    return steps;
};

var solution = R.pipe(parseInput, solve);

module.exports = solution;