var R = require('ramda');
var Stack = require('mnemonist/stack');

var parseInput = R.pipe(R.trim, R.split(''));

var shouldReact = (stack, unit) => unit !== stack.peek() && unit.toUpperCase() === (stack.peek() || "").toUpperCase();
var react = (stack, unit) => { stack.pop(); return stack; };
var dontReact = (stack, unit) => { stack.push(unit); return stack; };
var isSkipped = R.curry((skip, stack, unit) => skip === unit.toLowerCase());
var attemptReaction = skip => R.ifElse(isSkipped(skip), R.identity, R.ifElse(shouldReact, react, dontReact));
var reactPolymer = skip => R.reduce(attemptReaction(skip), new Stack());
var shortestPolymer = polymer => R.reduce((min, letter) => R.min(min, reactPolymer(letter)(polymer).size), Infinity, 'abcdefghijklmnopqrstuvwxyz');

var solution = R.pipe(parseInput, shortestPolymer);

module.exports = solution;