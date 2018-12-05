var R = require('ramda');
var Stack = require('mnemonist/stack');

var parseInput = R.pipe(R.trim, R.split(''));

var shouldReact = (stack, unit) => unit !== stack.peek() && unit.toUpperCase() === (stack.peek() || "").toUpperCase();
var react = (stack, unit) => { stack.pop(); return stack; };
var dontReact = (stack, unit) => { stack.push(unit); return stack; };
var attemptReaction = R.ifElse(shouldReact, react, dontReact);
var reactPolymer = R.reduce(attemptReaction, new Stack());

var solution = R.pipe(parseInput, reactPolymer, R.prop('size'));

module.exports = solution;