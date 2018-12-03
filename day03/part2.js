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
    var val = fabric[inch] || 0;
    fabric[inch] = val + 1;
    return fabric;
};
var applyClaim = (fabric, claim) => R.reduce(claimInch, fabric, squareInches(claim));
var applyClaims = R.reduce(applyClaim, []);
var findNonOverlappingClaim = claims => {
    var fabric = applyClaims(claims);
    var claimDoesntOverlap = R.pipe(squareInches, R.reduce((noOverlap, inch) => noOverlap && fabric[inch] === 1, true));
    return R.find(claimDoesntOverlap, claims).id;
};

var solution = R.pipe(parseInput, findNonOverlappingClaim);

module.exports = solution;