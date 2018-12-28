var R = require('ramda');
var edgeMap = require('../graphs/graph-edges-map');
var bfs = require('../pathfinding/bfs');
var debug = x => { debugger; return x; };

var parseLine = R.pipe(R.split(','), R.map(parseInt));
var parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseLine));

var first = set => set.values().next().value;
var manhattan = R.pipe(R.zip, R.map(x => Math.abs(x[0] - x[1])), R.sum);

var run = stars => {
    var edges = edgeMap(stars, (a, b) => manhattan(a, b) <= 3);
    var unvisited = new Set(stars);

    var constellations = [];
    while(unvisited.size > 0) {
        var star = first(unvisited);
        var constellation = [];
        bfs(star, x => { constellation.push(star); unvisited.delete(x); return false; }, x => edges.get(x), x => `${x[0]},${x[1]},${x[2]},${x[3]}`);
        constellations.push(constellation);
    }

    return constellations.length;
};

var solution = R.pipe(parseInput, run);

module.exports = solution;