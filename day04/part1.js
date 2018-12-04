var R = require('ramda');

var lineRegex = /\[(\d+-\d+-\d+ \d+:(\d+))\](?: Guard #(\d+))? ((?:falls asleep)|(?:wakes up)|(?:begins shift))/;
var parseLine = R.pipe(R.match(lineRegex), R.tail, R.zipObj(['datetime', 'min', 'id', 'action']))
var parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseLine));

var id;
var fixIds = R.forEach(x => { x.id = id = x.id || id; });
var filterBeginShifts = R.filter(x => x.action !== 'begins shift');
var expandPair = pair => R.map(x => ({ min: x, id: pair[0].id }), R.range(parseInt(pair[0].min), parseInt(pair[1].min)));
var expandMinutes = R.pipe(R.splitEvery(2), R.map(expandPair), R.flatten);
var groupProp = prop => R.pipe(R.sortBy(R.prop(prop)), R.groupWith((a, b) => R.prop(prop, a) === R.prop(prop, b)));
var maxArrayLength = R.reduce((acc, x) => acc.length > x.length ? acc : x, []);
var answer = record => record.min * parseInt(record.id);
var solution = R.pipe(parseInput, R.sortBy(R.prop('datetime')), fixIds, filterBeginShifts, expandMinutes, groupProp('id'), maxArrayLength, groupProp('min'), maxArrayLength, R.head, answer);

module.exports = solution;