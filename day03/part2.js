var R = require('ramda');

var lineRegex = /#(\d*) @ (\d*),(\d*): (\d*)x(\d*)/;
var parseLine = R.pipe(R.match(lineRegex), R.tail, R.map(parseInt), R.zipObj(['id', 'x', 'y', 'w', 'h']));
var parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseLine));

var makeGrid = (x, y) => R.map(() => R.repeat(0, y), R.repeat(0, x));
var traverseClaim = (claim, f) => {
    for(var x = claim.x; x < claim.x + claim.w; x++)
        for(var y = claim.y; y < claim.y + claim.h; y++)
            f(x, y);
}
var findNonOverlappingClaim = claims => {
    var grid = makeGrid(1000, 1000);
    for(var claim of claims) {
        traverseClaim(claim, (x, y) => grid[x][y]++);
    }

    for(var claim of claims) {
        var noOverlap = true;
        traverseClaim(claim, (x, y) => { noOverlap &= grid[x][y] === 1; });
        if (noOverlap) return claim.id;
    }
};

var solution = R.pipe(parseInput, findNonOverlappingClaim);

module.exports = solution;