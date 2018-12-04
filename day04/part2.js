var R = require('ramda');

var lineRegex = /\[(\d+-\d+-\d+ \d+:(\d+))\](?: Guard #(\d+))? ((?:falls asleep)|(?:wakes up)|(?:begins shift))/;
var parseLine = R.pipe(R.match(lineRegex), R.tail, R.zipObj(['datetime', 'min', 'id', 'action']), R.evolve({min: parseInt, id: parseInt}));
var parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseLine));

var id;
var fillIds = R.forEach(x => { x.id = id = x.id || id; });
var withoutShifts = R.filter(x => x.action !== 'begins shift');
var expandPair = (sleep, wake) => R.map(x => ({ min: x, id: sleep.id }), R.range(sleep.min, wake.min));
var expandMins = R.pipe(R.splitEvery(2), R.map(R.apply(expandPair)), R.flatten);
var group = f => R.pipe(R.sortBy(f), R.groupWith((a, b) => f(a) === f(b)));
var biggestArray = R.reduce((acc, x) => acc.length > x.length ? acc : x, []);
var answer = x => x.min * x.id;
var solution = R.pipe(parseInput, R.sortBy(x => x.datetime), fillIds, withoutShifts, expandMins, group(x => x.id), R.map(group(x => x.min)), R.unnest, biggestArray, R.head, answer);

module.exports = solution;