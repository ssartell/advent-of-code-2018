var R = require('ramda');

var lineRegex = /(\d+), (\d+)/;
var parseLine = R.pipe(R.match(lineRegex), R.tail, R.map(parseInt), R.zipObj(['x', 'y']));
var parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseLine));

var min = R.reduce(R.min, Infinity);
var max = R.reduce(R.max, -Infinity);

var asLocations = function* (coords) {
    var xs = R.map(R.prop('x'), coords);
    var ys = R.map(R.prop('y'), coords);
    var minX = min(xs);
    var maxX = max(xs);
    var minY = min(ys);
    var maxY = max(ys);
    for(var x = minX; x <= maxX; x++) {
        for (var y = minY; y <= maxY; y++) {
            var isEdge = x === minX || x === maxX || y === minY || y === maxY;
            yield {x, y, isEdge};
        }
    }       
};

var manhattan = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
var closestTo = R.curry((loc, a, b) => {
    var manA = manhattan(loc, a);
    var manB = manhattan(loc, b);
    if (manA < manB) return a;
    if (manB < manA) return b;
    return {x: a.x, y: a.y};
});

var withClosestCounts = coords => {
    for(var loc of asLocations(coords)) {
        var closestCoord = R.reduce(closestTo(loc), {x: Infinity, y: Infinity}, coords);
        closestCoord.count = loc.isEdge ? Infinity : (closestCoord.count || 0) + 1;
    }
    return coords;
};
var biggestArea = R.pipe(R.map(x => x.count), R.filter(x => x !== Infinity), max);

var solution = R.pipe(parseInput, withClosestCounts, biggestArea);

module.exports = solution;