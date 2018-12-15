var R = require('ramda');
var debug = x => { debugger; return x; };

var parseInput = R.pipe(R.trim);

var solution = R.pipe(parseInput, debug);

module.exports = solution;