var R = require('ramda');

var lineRegex = /#(\d*) @ (\d*),(\d*): (\d*)x(\d*)/;
var parseLine = R.pipe(R.match(lineRegex), R.tail, R.map(parseInt), R.zipObj(['id', 'x', 'y', 'w', 'h']));
var parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseLine));

var makeGrid = (x, y) => R.map(() => R.repeat(0, y), R.repeat(0, x));
var applyClaims = claims => {
    var grid = makeGrid(1000, 1000);
    for(var claim of claims) {
        for(var x = claim.x; x < claim.x + claim.w; x++) {
            for(var y = claim.y; y < claim.y + claim.h; y++) {
                grid[x][y]++;
            }
        }
    }

    return grid;
};
var totalOverlaps = R.pipe(R.flatten, R.map(x => +(x > 1)), R.sum);

var solution = R.pipe(parseInput, applyClaims, totalOverlaps);

module.exports = solution;