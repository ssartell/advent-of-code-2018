var R = require('ramda');
var debug = x => { debugger; return x; };
var gridSize = 300;

var parseInput = R.pipe(R.trim, parseInt);

var getHalf = R.memoize(x => Math.floor(x / 2));

var memory = new Map();
var powerLevelOfSquare = (serial, squareSize, x, y) => {
    var key = `${squareSize},${x},${y}`;

    if (memory.has(key)) {
        return memory.get(key);
    }

    var powerLevel = 0;
    if (squareSize === 1) {
        var rackId = x + 10;
        powerLevel = rackId * y;
        powerLevel += serial;
        powerLevel *= rackId;
        powerLevel = Math.floor((powerLevel / 100) % 10);
        powerLevel -= 5;
    } else {
        var half = getHalf(squareSize);
        var xPlusHalf = x + half;
        var yPlusHalf = y + half;

        if (half + half === squareSize) {
            powerLevel += powerLevelOfSquare(serial, half, x, y);
            powerLevel += powerLevelOfSquare(serial, half, xPlusHalf, y);
            powerLevel += powerLevelOfSquare(serial, half, x, yPlusHalf);
            powerLevel += powerLevelOfSquare(serial, half, xPlusHalf, yPlusHalf);
        } else {
            var largerHalf = squareSize - half;

            powerLevel += powerLevelOfSquare(serial, largerHalf, x, y);
            powerLevel += powerLevelOfSquare(serial, half, x + largerHalf, y);
            powerLevel += powerLevelOfSquare(serial, half, x, y + largerHalf);
            powerLevel += powerLevelOfSquare(serial, largerHalf, xPlusHalf, yPlusHalf);
            powerLevel -= powerLevelOfSquare(serial, 1, xPlusHalf, yPlusHalf);
        }
    }

    memory.set(key, powerLevel);
    return powerLevel;
};

var solve = serial => {
    var max = -Infinity;
    var coords;
    for(var squareSize = 1; squareSize <= 300; squareSize++) {
        for(var x = 1; x + squareSize <= gridSize; x++) {
            for(var y = 1; y + squareSize <= gridSize; y++) {
                var totalPowerLevel = powerLevelOfSquare(serial, squareSize, x, y);

                if (totalPowerLevel > max) {
                    max = totalPowerLevel;
                    coords = `${x},${y},${squareSize}`;
                }
            }
        }
    }

    return coords;
};

var solution = R.pipe(parseInput, solve);

module.exports = solution;