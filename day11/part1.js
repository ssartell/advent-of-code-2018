var R = require('ramda');
var gridSize = 300;
var squareSize = 3;

var parseInput = R.pipe(R.trim, parseInt);

var powerLevel = R.memoize((serial, x, y) => {
    var rackId = x + 10;
    var powerLevel = rackId * y;
    powerLevel += serial;
    powerLevel *= rackId;
    powerLevel = Math.floor((powerLevel / 100) % 10);
    powerLevel -= 5;
    return powerLevel;
});

var powerLevelOfSquare = R.memoize((serial, squareSize, x, y) => {
    var totalPowerLevel = 0;
    for(var i = 0; i < squareSize; i++) {
        for(var j = 0; j < squareSize; j++) {
            totalPowerLevel += powerLevel(serial, x + i, y + j);
        }
    }

    return totalPowerLevel;
})

var solve = serial => {
    var max = -Infinity;
    var coords;
    for(var x = 1; x <= gridSize - squareSize; x++) {
        for(var y = 1; y <= gridSize - squareSize; y++) {
            var totalPowerLevel = powerLevelOfSquare(serial, 3, x, y);

            if (totalPowerLevel > max) {
                max = totalPowerLevel;
                coords = `${x},${y}`;
            }
        }
    }

    return coords;
};

var solution = R.pipe(parseInput, solve);

module.exports = solution;