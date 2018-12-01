var R = require('ramda');

var asRing = function* (arr) {
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

var solution = x => R.pipe(parseInput, asRing, R.reduceWhile(isNewFreq, addKnownFreq, {freq: 0, known: new Set()}), R.prop("freq"))(x);

module.exports = solution;