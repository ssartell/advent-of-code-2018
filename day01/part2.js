var R = require('ramda');

var makeCycle = function* (arr) {
    while(true)
        for(var x of arr)
            yield x;
};

var parseInput = R.pipe(R.trim, R.split(/, |\n/), R.map(parseInt));

var isUnknownFreq = (state, x) => !state.set.has(state.current);
var addKnownFreq = (state, x) => ({
    set: state.set.add(state.current),
    current: state.current + x
});

var solution = R.pipe(parseInput, makeCycle, R.reduceWhile(isUnknownFreq, addKnownFreq, {current: 0, set: new Set()}), R.prop("current"));

module.exports = solution;