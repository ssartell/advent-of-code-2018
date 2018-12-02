var R = require('ramda');

var parseInput = R.pipe(R.trim, R.split('\n'));

var getLetterCounts = R.pipe(R.groupBy(x => x), R.map(x => x.length), R.invert);
var countWith = R.curry((n, list) => R.pipe(R.map(R.has(n)), R.sum)(list));
var calcCheckSum = R.converge(R.multiply, [countWith(2), countWith(3)]);

var solution = R.pipe(parseInput, R.map(getLetterCounts), calcCheckSum);

module.exports = solution;