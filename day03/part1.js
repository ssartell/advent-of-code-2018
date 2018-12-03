var R = require('ramda');
var size = 1000;

var lineRegex = /#(\d*) @ (\d*),(\d*): (\d*)x(\d*)/;
var parseLine = R.pipe(R.match(lineRegex), R.tail, R.map(parseInt), R.zipObj(['id', 'x', 'y', 'w', 'h']));
var parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseLine));

var squareInches = function* (claim) {
    for(var x = claim.x; x < claim.x + claim.w; x++)
        for(var y = claim.y; y < claim.y + claim.h; y++)
            yield x * size + y;
}
var claimInch = (fabric, inch) => { 
    fabric[inch] = (fabric[inch] || 0) + 1;
    return fabric;
};
var applyClaim = (fabric, claim) => R.reduce(claimInch, fabric, squareInches(claim));
var applyClaims = R.reduce(applyClaim, []);
var totalOverlaps = R.pipe(R.map(x => +(x > 1)), R.sum);

var solution = R.pipe(parseInput, applyClaims, totalOverlaps);

module.exports = solution;