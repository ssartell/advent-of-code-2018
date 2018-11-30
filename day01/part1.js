var R = require('ramda');

var parseInput = R.pipe(R.trim);

var solution = R.pipe(parseInput);

module.exports = solution;