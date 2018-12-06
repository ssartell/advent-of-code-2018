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
    for(var x = minX; x <= maxX; x++)
        for (var y = minY; y <= maxY; y++)
            yield {x, y};   
};

var manhattan = R.curry((a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y));

var solve = coords => {
    var count = 0;
    for(var loc of asLocations(coords)) {
        var sum = R.pipe(R.map(manhattan(loc)), R.sum)(coords);
        if (sum < 10000) count++;
    }

    return count;
}

var solution = R.pipe(parseInput, solve);

module.exports = solution;