var R = require('ramda');
var edgeMap = require('../graphs/edge-map');
var maxClique = require('../graphs/bron-kerbosch');

var lineRegex = /pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(-?\d+)/;
var parseLine = R.pipe(R.match(lineRegex), R.tail, R.map(parseInt), R.zipObj(['x', 'y', 'z', 'range']));
var parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseLine));

var manhattan = R.curry((a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z));
var origin = {x: 0, y: 0, z: 0};

var add = (a, b) => ({x: a.x + b.x, y: a.y + b.y, z: a.z + b.z});
var scale = (a, s) => ({x: a.x * s, y: a.y * s, z: a.z * s});
var dirs = [
    {x: -1, y: 0, z: 0},
    {x: 1, y: 0, z: 0},
    {x: 0, y: -1, z: 0},
    {x: 0, y: 1, z: 0},
    {x: 0, y: 0, z: -1},
    {x: 0, y: 0, z: 1},
];
var botsIntersect = (a, b) => manhattan(a, b) <= a.range + b.range;

var botSdf = R.curry((bot, p) => manhattan(bot, p) - bot.range);

var run = bots => {
    var ints = edgeMap(bots, botsIntersect);
    var clique = maxClique(ints, new Set(bots));

    var combinedSdf = p => 0;
    for(var bot of clique) {
        let thisBotSdf = botSdf(bot);
        let prevSdf = combinedSdf;
        combinedSdf = p => R.max(prevSdf(p), thisBotSdf(p));
    }
    combinedSdf = R.memoizeWith(p => `${p.x},${p.y},${p.z}`, combinedSdf);

    var p = origin;
    for(var dir of dirs) {
        var dist = combinedSdf(p);
        if (combinedSdf(add(p, dir)) >= dist) continue;
        var dist2 = combinedSdf(add(p, scale(dir, dist)));
        p = add(p, scale(dir, dist - Math.floor(dist2 / 2)));
    }
    
    var dist2 = combinedSdf(add(p, scale(dir, dist)));

    return manhattan(origin, p);
};

var solution = R.pipe(parseInput, run);

module.exports = solution;