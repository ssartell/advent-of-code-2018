var R = require('ramda');
var Stack = require('mnemonist/stack');
var debug = x => { debugger; return x; };

var parseInput = R.pipe(R.trim, R.split(''));

var dirs = {
    'N': pos => ({x: pos.x, y: pos.y - 1}),
    'S': pos => ({x: pos.x, y: pos.y + 1}),
    'W': pos => ({x: pos.x - 1, y: pos.y}),
    'E': pos => ({x: pos.x + 1, y: pos.y}),
};
var isDir = x => x === 'N' || x === 'S' || x === 'W' || x === 'E';
var getKey = pos => `${pos.x},${pos.y}`;

var run = input => {
    var loc = {pos: {x: 0, y: 0}, dist: 0};
    var stack = new Stack();

    var seen = new Map();
    var maxDist = 0;

    for(var i = 1; i < input.length - 1; i++) {
        var key = getKey(loc.pos);
        if (!seen.has(key)) {
            seen.set(key, loc.dist);
            
            if (loc.dist > maxDist) {
                maxDist = loc.dist;
            }
        }

        var char = input[i];
        if (isDir(char)) {
            loc = {pos: dirs[char](loc.pos), dist: loc.dist + 1};
        } else if (char === '(') {
            stack.push(loc);
        } else if (char === ')') {
            loc = stack.pop(loc);
        } else if (char === '|') {
            loc = stack.peek(loc);
        }
    }

    return maxDist;
}

var solution = R.pipe(parseInput, run);

module.exports = solution;