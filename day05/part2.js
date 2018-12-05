var R = require('ramda');
var Stack = require('mnemonist/stack');

var parseInput = R.pipe(R.trim, R.split(''));

var sameLetter = R.curry((a, b) => a.toUpperCase() === b.toUpperCase());
var differentCase = R.curry((a, b) => a !== b && sameLetter(a, b));
var shouldReact = (stack, unit) => differentCase(unit, stack.peek() || '');
var react = (stack, unit) => { stack.pop(); return stack; };
var dontReact = (stack, unit) => { stack.push(unit); return stack; };
var attemptReaction = R.ifElse(shouldReact, react, dontReact);
var reactPolymer = R.reduce(attemptReaction);
var shortestPolymer = polymer => R.reduce((min, letter) => R.min(min, reactPolymer(new Stack(), R.reject(sameLetter(letter), polymer)).size), Infinity, 'abcdefghijklmnopqrstuvwxyz');

var solution = R.pipe(parseInput, shortestPolymer);

module.exports = solution;