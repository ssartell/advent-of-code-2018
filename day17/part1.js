var R = require('ramda');
var Queue = require('mnemonist/queue');
var debug = x => { debugger; return x; };

var tryParseInt = x => isNaN(parseInt(x)) ? x : parseInt(x);
var lineRegex = /(x|y)=(\d+), (x|y)=(\d+).?.?(\d+)?/;
var startEnd = arr => ({min: arr[0 % arr.length], max: arr[1 % arr.length] });
var parseLine = R.pipe(R.match(lineRegex), R.tail, R.map(tryParseInt), R.splitAt(2), R.sortBy(R.head), R.map(R.pipe(R.tail, startEnd)), R.zipObj(['x', 'y']));
var parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseLine));

var min = R.reduce(R.min, Infinity);
var max = R.reduce(R.max, -Infinity);
var key = coords => `${coords.x},${coords.y}`;
var isOpenSpace = x => x === '.';
var isClay = x => x === '#';
var isWetSand = x => x === '|';
var isWater = x => x === '~';
var step = (coords, dir) => ({x: coords.x + dir.x, y: coords.y + dir.y});
var get = (map, coords) => map.get(key(coords)) || '.';
var setWetSand = (map, coords) => { map.set(key(coords), '|'); };
var setWater = (map, coords) => { map.set(key(coords), '~'); };
var down = {x:0, y:1};
var left = {x:-1, y:0};
var right = {x:1, y:0};
var outOfBounds = (bounds, loc) => loc.y < bounds.minY || bounds.maxY < loc.y;

var run = veins => {
    var minX = min(R.map(vein => vein.x.min, veins));
    var maxX = max(R.map(vein => vein.x.max, veins));
    var minY = min(R.map(vein => vein.y.min, veins));
    var maxY = max(R.map(vein => vein.y.max, veins));
    var bounds = {minX, maxX, minY, maxY};

    var map = new Map();
    for(var vein of veins) {
        for(var y = vein.y.min; y <= vein.y.max; y++) {
            for(var x = vein.x.min; x <= vein.x.max; x++) {
                map.set(key({x, y}), '#');
            }
        }
    }

    var start = {x: 500, y: bounds.minY};
    flowDown(map, bounds, start);
    print(map, bounds);
    return R.pipe(Array.from, R.map(x => isWetSand(x) || isWater(x) ? 1 : 0), R.sum)(map.values());
};

var flowDown = (map, bounds, loc) => {
    if (outOfBounds(bounds, loc)) return false;

    setWetSand(map, loc);
    //print(map, bounds);

    var belowLoc = step(loc, down);
    var belowThing = get(map, belowLoc);
    if (isWetSand(belowThing)) {
        return false;
    } else if (isOpenSpace(belowThing)) {
        return flowDown(map, bounds, belowLoc) ? flowToSides(map, bounds, loc) : false;
    } else {
        return flowToSides(map, bounds, loc);
    }
};

var flowToSides = (map, bounds, loc) => {
    var filledLeft = flowSideways(map, bounds, step(loc, left), left);
    var filledRight = flowSideways(map, bounds, step(loc, right), right);
    var filled = filledLeft && filledRight;

    if (filled) fillWithWater(map, bounds, loc)
    return filled;
};

var flowSideways = (map, bounds, loc, dir) => {
    var thing = get(map, loc);
    if (isClay(thing)) return true;
    
    setWetSand(map, loc);
    //print(map, bounds);

    var belowLoc = step(loc, down);
    var belowThing = get(map, belowLoc);
    var nextLoc = step(loc, dir);
    if (isOpenSpace(belowThing)) {
        return flowDown(map, bounds, belowLoc) ? flowSideways(map, bounds, nextLoc, dir) : false;
    } else {
        return flowSideways(map, bounds, nextLoc, dir);
    }
};

var fillWithWater = (map, bounds, loc) => {
    var thing = get(map, loc);
    if (!isWetSand(thing)) return;

    setWater(map, loc);
    fillWithWater(map, bounds, step(loc, left));
    fillWithWater(map, bounds, step(loc, right));
};

var print = (map, bounds) => {
    for(var y = bounds.minY; y <= bounds.maxY; y++) {
        var line = '';
        for(var x = bounds.minX; x <= bounds.maxX; x++) {
            line += get(map, {x, y});
        }
        console.log(line);
    }
    console.log('\n');
}

var solution = R.pipe(parseInput, run);

module.exports = solution;