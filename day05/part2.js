var R = require('ramda');
var Stack = require('mnemonist/stack');
var alphabet = 'abcdefghijklmnopqrstuvwxyz';

var parseInput = R.pipe(R.trim, R.split(''));

var shouldReact = (a, b) => a !== b && a.toUpperCase() === b.toUpperCase();
var react = (polymer, skip) => {
    var stack = new Stack();
    for(var unit of polymer) {
        if (unit.toLowerCase() === skip) continue;
        var top = stack.peek() || "";
        if (shouldReact(unit, top)) {
            stack.pop();
        } else {
            stack.push(unit);
        }
    }
    return stack.size;
}
var shortestPolymer = polymer => R.reduce((min, letter) => R.min(min, react(polymer, letter)), Infinity, alphabet);

var solution = R.pipe(parseInput, shortestPolymer);

module.exports = solution;