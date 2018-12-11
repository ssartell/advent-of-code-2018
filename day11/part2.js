var R = require('ramda');
var debug = x => { debugger; return x; };
var gridSize = 300;

var parseInput = R.pipe(R.trim, parseInt);

var getHalf = R.memoize(x => Math.floor(x / 2));

var memory = new Map();
var customMemoize = function(f) {
    return function() {
        var key = `${arguments[1]},${arguments[2]},${arguments[3]}`;
        
        var value = memory.get(key);
        if (value === undefined) {
            value = f.apply(null, arguments);
            memory.set(key, value);
        }
        return value;
    }
};

var powerLevelOfSquare = customMemoize((serial, squareSize, x, y) => {
    if (squareSize === 1) {
        var rackId = x + 10;
        var powerLevel = rackId * y;
        powerLevel += serial;
        powerLevel *= rackId;
        powerLevel = Math.floor((powerLevel / 100) % 10);
        powerLevel -= 5;
        return powerLevel;
    } else {
        var totalPowerLevel = 0;
        var half = getHalf(squareSize);
        var xPlusHalf = x + half;
        var yPlusHalf = y + half;

        if (half + half === squareSize) {
            totalPowerLevel += powerLevelOfSquare(serial, half, x, y);
            totalPowerLevel += powerLevelOfSquare(serial, half, xPlusHalf, y);
            totalPowerLevel += powerLevelOfSquare(serial, half, x, yPlusHalf);
            totalPowerLevel += powerLevelOfSquare(serial, half, xPlusHalf, yPlusHalf);
        } else {
            var largerHalf = squareSize - half;

            totalPowerLevel += powerLevelOfSquare(serial, largerHalf, x, y);
            totalPowerLevel += powerLevelOfSquare(serial, half, x + largerHalf, y);
            totalPowerLevel += powerLevelOfSquare(serial, half, x, y + largerHalf);
            totalPowerLevel += powerLevelOfSquare(serial, largerHalf, xPlusHalf, yPlusHalf);
            totalPowerLevel -= powerLevelOfSquare(serial, 1, xPlusHalf, yPlusHalf);
        }

        return totalPowerLevel;
    }
})

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