var R = require('ramda');
var Stack = require('mnemonist/stack');

var parseInput = R.pipe(R.trim, R.split(''));

var shouldReact = (a, b) => a !== b && a.toUpperCase() === b.toUpperCase();
var react = polymer => {
    var stack = new Stack();
    for(var unit of polymer) {
        var top = stack.peek() || "";
        if (shouldReact(unit, top)) {
            stack.pop();
        } else {
            stack.push(unit);
        }
    }
    return stack.size;
}

var solution = R.pipe(parseInput, react);

module.exports = solution;