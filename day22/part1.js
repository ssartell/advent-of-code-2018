var R = require('ramda');
var debug = x => { debugger; return x; };

var numRegex = /(\d+)/g;
var parseInput = R.pipe(R.trim, R.match(numRegex), R.map(parseInt), R.zipObj(['depth', 'x', 'y']));

var getKey = (depth, target, coords) => `${coords.x},${coords.y}`;

var getGeoIndex = (depth, target, coords) => {
    if (coords.x === 0 && coords.y === 0) return 0;
    if (coords.x === target.x && coords.y === target.y) return 0;
    if (coords.y === 0) return coords.x * 16807;
    if (coords.x === 0) return coords.y * 48271;
    return getErosionLevel(depth, target, {x: coords.x - 1, y: coords.y}) * getErosionLevel(depth, target, {x: coords.x, y: coords.y - 1});
};
var getErosionLevel = R.memoizeWith(getKey, (depth, target, coords) => (getGeoIndex(depth, target, coords) + depth) % 20183);
var getType = (depth, target, coords) => getErosionLevel(depth, target, coords) % 3;

var run = input => {
    var depth = input.depth;
    var target = {x: input.x, y: input.y};

    var total = 0;
    for(var y = 0; y <= target.y; y++) {
        for(var x = 0; x <= target.x; x++) {
            total += getType(depth, target, {x, y});
        }
    }

    return total;
}

var solution = R.pipe(parseInput, run);

module.exports = solution;