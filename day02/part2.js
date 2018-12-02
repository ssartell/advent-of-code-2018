var R = require('ramda');
var levenshtein = require('fast-levenshtein');
var C = require('js-combinatorics');

var parseInput = R.pipe(R.trim, R.split('\r\n'));
var levOf2 = arr => C.bigCombination(arr, 2).find(pair => R.apply(levenshtein.get, pair) === 1);
var commonLetters = R.pipe(R.apply(R.zip), R.filter(R.apply(R.equals)), R.map(R.head), R.join(''));

var solution = R.pipe(parseInput, levOf2, commonLetters);

module.exports = solution;