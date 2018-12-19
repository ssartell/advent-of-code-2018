var R = require('ramda');
var debug = x => { debugger; return x; };

var parseInput = R.pipe(R.trim, R.split('\n'), R.map(R.pipe(R.trim, R.split(''))));

var isOpenGround = x => x === '.';
var isTrees = x => x === '|';
var isLumberyard = x => x === '#';
var get = (map, coord) => map[coord.y][coord.x];
var set = (map, coord, val) => map[coord.y][coord.x] = val;
var blankMap = (width, height) => R.repeat([], height).map(x => R.repeat('.', width));
var sumBooleans = R.pipe(R.map(x => x ? 1 : 0), R.sum);

var getNeighbors = function* (map, coord) {
    for(var j = coord.y - 1; j <= coord.y + 1; j++) {
        for(var i = coord.x - 1; i <= coord.x + 1; i++) {
            if (j === coord.y && i === coord.x) continue;
            if (map[j] && map[j][i]) yield map[j][i];
        }
    }    
};

var getCoords = function* (width, height) {
    for(var y = 0; y < height; y++) {
        for(var x = 0; x < width; x++) {
            yield {x, y};
        }
    }
};

var print = map => {
    for(var y = 0; y < map.length; y++) {
        console.log(map[y].join(''));
    }
    console.log('\n');
}

var totalWooded = R.pipe(R.map(isTrees), sumBooleans);
var totalLumberYards = R.pipe(R.map(isLumberyard), sumBooleans);
var resourceValue = R.pipe(R.flatten, R.converge(R.multiply, [totalWooded, totalLumberYards]));

var run = map => {
    var height = map.length;
    var width = map[0].length;

    var newMap = map;
    for(var i = 0; i < 10; i++) {
        var oldMap = newMap;
        newMap = blankMap(width, height);
        for(var coord of getCoords(width, height)) {
            var acre = get(oldMap, coord);
            var neighbors = Array.from(getNeighbors(oldMap, coord));
            if (isOpenGround(acre)) {
                var threeOrMoreTrees = R.pipe(R.map(isTrees), sumBooleans, x => x >= 3)(neighbors);
                set(newMap, coord, threeOrMoreTrees ? '|' : acre);
            } else if (isTrees(acre)) {
                var threeOrMoreLumberyards = R.pipe(R.map(isLumberyard), sumBooleans, x => x >= 3)(neighbors);
                set(newMap, coord, threeOrMoreLumberyards ? '#' : acre);
            } else if (isLumberyard(acre)) {
                var aLumberyardAndTree = R.any(isLumberyard, neighbors) && R.any(isTrees, neighbors);
                set(newMap, coord, aLumberyardAndTree ? '#' : '.');
            }
        }
    }

    return resourceValue(newMap);
}

var solution = R.pipe(parseInput, run);

module.exports = solution;