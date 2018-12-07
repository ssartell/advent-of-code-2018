var R = require('ramda');
var helpers = require('mnemonist/set');
var Heap = require('mnemonist/heap');

var lineRegex = /Step (.) must be finished before step (.) can begin./;
var parseLine = R.pipe(R.match(lineRegex), R.tail, R.zipObj(['l', 'r']));
var parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseLine));

var timeForStep = step => 60 + step.charCodeAt(0) - 64;
var addToMap = (map, a, b) => {
    if (map.has(a)) {
        map.get(a).add(b);
    } else {
        map.set(a, new Set([b]));
    }
};
var createWork = (t0, ts, step) => {
    var minT = R.reduce(R.min, Infinity, ts);
    var i = R.findIndex(R.equals(minT), ts);
    var t1 = R.max(minT, t0) + timeForStep(step);
    ts[i] = t1;
    return { step, t: t1 };
};

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
    
    var t = 0;
    var ts = R.repeat(0, 5);
    var workBeingDone = new Heap(R.comparator((a, b) => a.t < b.t || (a.t === b.t && a.step < b.step)));
    R.forEach(x => workBeingDone.push(createWork(0, ts, x)), helpers.difference(left, right));

    while(workBeingDone.peek()) {
        var doneWork = workBeingDone.pop();
        t = doneWork.t;
        var step = doneWork.step;
        var rights = leftToRight.get(step);
        leftToRight.delete(step);

        if (!rights) continue;
        for(var right of rights) {
            var lefts = rightToLeft.get(right);
            lefts.delete(step);
            if (lefts.size === 0) {
                workBeingDone.push(createWork(t, ts, right));
            }
        }
    }
    return t;
};

var solution = R.pipe(parseInput, solve);

module.exports = solution;