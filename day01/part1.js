var R = require('ramda');

var parseInput = R.pipe(R.trim, R.split(/, |\n/), R.map(parseInt));
var solution = R.pipe(parseInput, R.sum);

module.exports = solution;