var R = require('ramda');
var debug = x => { debugger; return x; };
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
    if (squareSize === 1) {
        return powerLevel(serial, x, y);
    } else {
        var totalPowerLevel = 0;
        totalPowerLevel += powerLevelOfSquare(serial, squareSize - 1, x + 1, y + 1);

        for (var i = 0; i < squareSize; i++) {
            totalPowerLevel += powerLevel(serial, x + i, y);
        }

        for (var j = 1; j < squareSize; j++) {
            totalPowerLevel += powerLevel(serial, x, y + j);
        }

        return totalPowerLevel;
    }
})

var solve = serial => {
    var max = -Infinity;
    var coords;
    for(var squareSize = 1; squareSize <= 300; squareSize++) {
        console.log(squareSize);
        console.log(coords);
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