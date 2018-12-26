var R = require('ramda');
var C = require('js-combinatorics');
var binarySearch = require('../pathfinding/binarySearch');
var debug = x => { debugger; return x; };

var lineRegex = /pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(-?\d+)/;
var parseLine = R.pipe(R.match(lineRegex), R.tail, R.map(parseInt), R.zipObj(['x', 'y', 'z', 'range']));
var parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseLine));

// var boundingBoxVerts = i => [
//     {x: i.x - i.range, y: i.y - i.range, z: i.x - i.range},
//     {x: i.x + i.range, y: i.y + i.range, z: i.x + i.range}
// ];
// var rangesOverlap = ([min1, max1], [min2, max2]) => {
//     if (min1.x > max2.x || min2.x > max1.x) return false;
//     if (min1.y > max2.y || min2.y > max1.y) return false;
//     if (min1.z > max2.z || min2.z > max1.z) return false;
//     return true;
// };
// var intersection = ([min1, max1], [min2, max2]) => [
//     {x: R.min(min1.x, min2.x), y: R.min(min1.y, min2.y), z: R.min(min1.z, min2.z)},
//     {x: R.max(max1.x, max2.x), y: R.max(max1.y, max2.y), z: R.max(max1.z, max2.z)},
// ];
var getKey = i => `${i.x},${i.y},${i.z}`;
var manhattan = R.curry((a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z));
var origin = {x: 0, y: 0, z: 0};
var inRangeOfBot = (bot, i) => manhattan(bot, i) <= bot.range;
var vertsOfBotRange = bot => [
    {x: bot.x - bot.range, y: bot.y, z: bot.z},
    {x: bot.x + bot.range, y: bot.y, z: bot.z},
    {x: bot.x, y: bot.y - bot.range, z: bot.z},
    {x: bot.x, y: bot.y + bot.range, z: bot.z},
    {x: bot.x, y: bot.y, z: bot.z - bot.range},
    {x: bot.x, y: bot.y, z: bot.z + bot.range}
];
var allVerts = function* (bots) {
    for(var bot of bots) {
        for(var vert of vertsOfBotRange(bot)) {
            yield vert;
        }
    }
};
var midpoint = (a, b) => ({x: Math.floor((a.x + b.x) / 2), y: Math.floor((a.y + b.y) / 2), z: Math.floor((a.z + b.z) / 2)});

var min = R.reduce(R.min, Infinity);

var countBotsInRange = (bots, p) => {
    var botsInRange = 0;
    for(var bot of bots) {
        if (inRangeOfBot(bot, p)) 
            botsInRange++;
    }
    return botsInRange;
};

var run = bots => {
    var mostBotsInRange = 0;
    var bestVerts = [];

    for(var vert of allVerts(bots)) {
        var botsInRange = countBotsInRange(bots, vert);
        if (botsInRange === mostBotsInRange) {
            bestVerts.push(vert);
        }
        if (botsInRange > mostBotsInRange) {
            bestVerts = [vert];
            mostBotsInRange = botsInRange;
        }
    }

    var minDist = Infinity;
    for(var vert of bestVerts) {
        var result = binarySearch(origin, vert, midpoint, p => {
            var botsInRange = countBotsInRange(bots, p);
            if (botsInRange > mostBotsInRange) 
                mostBotsInRange = botsInRange;
            return botsInRange >= mostBotsInRange;
        }, (a, b) => manhattan(a, b) <= 3);
        minDist = R.min(minDist, manhattan(origin, result));
    }

    return minDist;
};

var solution = R.pipe(parseInput, run);

module.exports = solution;