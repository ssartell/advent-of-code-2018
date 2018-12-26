var R = require('ramda');
var maxClique = require('../graph/bron-kerbosch');

var lineRegex = /pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(-?\d+)/;
var parseLine = R.pipe(R.match(lineRegex), R.tail, R.map(parseInt), R.zipObj(['x', 'y', 'z', 'range']));
var parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseLine));

var manhattan = R.curry((a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z));
var origin = {x: 0, y: 0, z: 0};

var add = (a, b) => ({x: a.x + b.x, y: a.y + b.y, z: a.z + b.z});
var getNeighbors = function* (p, factor) {
    for(var z = -1; z <= 1; z++) {
        for(var y = -1; y <= 1; y++) {
            for(var x = -1; x <= 1; x++) {
                if (z === 0 && y === 0 && x === 0) continue;
                yield add(p, {x: x * factor, y: y * factor, z: z * factor});
            }
        }    
    }
};
var botsIntersect = (a, b) => manhattan(a, b) <= a.range + b.range;
var addIntersection = (intersections, a, b) => {
    var set = intersections.get(a);
    if (!set) {
        set = new Set();
        intersections.set(a, set);
    }
    set.add(b);
};
var getIntersections = bots => {
    var ints = new Map();
    for(var i = 0; i < bots.length; i++) {
        var a = bots[i];
        for(var j = i + 1; j < bots.length; j++) {
            var b = bots[j];
            if (botsIntersect(a, b)) {
                addIntersection(ints, a, b);
                addIntersection(ints, b, a);
            }
        }
    }
    return ints;
};

var botSdf = R.curry((bot, p) => manhattan(bot, p) - bot.range);

var run = bots => {
    var ints = getIntersections(bots);
    var clique = maxClique(ints, new Set(bots));

    var combinedSdf = p => 0;
    for(var bot of clique) {
        let thisBotSdf = botSdf(bot);
        let prevSdf = combinedSdf;
        combinedSdf = p => R.max(prevSdf(p), thisBotSdf(p));
    }
    combinedSdf = R.memoizeWith(p => `${p.x},${p.y},${p.z}`, combinedSdf);

    var p = origin;
    var descending = true;
    var minDist = combinedSdf(p);
    var factor = Math.pow(2, 24); // just pick a big number that's divisble by 2

    while(descending) {
        var foundLower = false;
        for(var neighbor of getNeighbors(p, factor)) {
            var dist = combinedSdf(neighbor);
            if (dist < minDist) {
                minDist = dist;
                p = neighbor;   // walk downhill
                foundLower = true;
                break;
            }
        }

        if (!foundLower) {
            factor = factor / 2; // slow down
            if (factor < 1) 
                descending = false
        }
    }

    return manhattan(origin, p);
};

var solution = R.pipe(parseInput, run);

module.exports = solution;