var R = require('ramda');
var connectedComponents = require('../graphs/connected-components');

var parseLine = R.pipe(R.split(','), R.map(parseInt));
var parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseLine));

var manhattan = R.pipe(R.zip, R.map(R.pipe(R.apply(R.subtract), Math.abs)), R.sum);
var areInConstellation = (a, b) => manhattan(a, b) <= 3;

var run = stars => {
    var constellations = connectedComponents(stars, areInConstellation);

    return constellations.length;
};

var solution = R.pipe(parseInput, run);

module.exports = solution;