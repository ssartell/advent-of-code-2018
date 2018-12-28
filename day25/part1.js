var R = require('ramda');
var edgeMap = require('../graphs/edge-map');
var Queue = require('mnemonist/queue');
var bfs = require('../pathfinding/bfs');
var debug = x => { debugger; return x; };

var parseLine = R.pipe(R.split(','), R.map(parseInt));
var parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseLine));

var manhattan = R.pipe(R.zip, R.map(x => Math.abs(x[0] - x[1])), R.sum);
//var first = set => set.values().next().value;
var matchingConstellation = (constellations, star) => R.filter(R.any(x => manhattan(x, star) <= 3), constellations);

var run = stars => {
    var constellations = [];
    for(var star of stars) {
        var matches = matchingConstellation(constellations, star);
        if (matches && matches.length > 0) {
            constellations = R.without(matches, constellations);
            var newConst = R.unnest(matches);
            newConst.push(star);
            constellations.push(newConst);
        } else {
            constellations.push([star]);
        }
    }
    return constellations.length;
}

var solution = R.pipe(parseInput, run);

module.exports = solution;