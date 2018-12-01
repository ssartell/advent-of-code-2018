var R = require('ramda');

var makeCycle = function* (arr) {
    while(true)
        for(var x of arr)
            yield x;
};

var parseInput = R.pipe(R.trim, R.split(/, |\n/), R.map(parseInt));

var isNewFreq = (state, x) => !state.known.has(state.freq);
var addKnownFreq = (state, x) => ({
    known: state.known.add(state.freq),
    freq: state.freq + x
});

var solution = R.pipe(parseInput, makeCycle, R.reduceWhile(isNewFreq, addKnownFreq, {freq: 0, known: new Set()}), R.prop("freq"));

module.exports = solution;