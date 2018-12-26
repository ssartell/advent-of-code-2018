var R = require('ramda');
var C = require('js-combinatorics');
var debug = x => { debugger; return x; };

var lineRegex = /pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(-?\d+)/;
var parseLine = R.pipe(R.match(lineRegex), R.tail, R.map(parseInt), R.zipObj(['x', 'y', 'z', 'range']));
var parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseLine));

// var botKey = i => `${i.x},${i.y},${i.z},${i.range}`;
var manhattan = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);
var inRange = R.curry((a, b) => manhattan(a, b) <= a.range);

var inRangeOfStrongest = bots => {
    var strongest = R.pipe(R.sortWith([R.descend(x => x.range)]), R.head)(bots);
    return R.filter(inRange(strongest), bots);
};

var solution = R.pipe(parseInput, inRangeOfStrongest, R.length);

module.exports = solution;