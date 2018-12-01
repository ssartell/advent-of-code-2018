var R = require('ramda');

var parseInput = R.pipe(R.trim, R.split(/, |\n/), R.map(parseInt));

var makeCycle = function* (list) {
    while(true) {
        for(var x of list) {
            yield x;
        }
    }
};

var isUnknownFreq = (state, x) => !R.has(state.current, state.set);
var addKnownFreq = (state, x) => {
    state.set[state.current] = 1;
    return {
        set: state.set,
        current: state.current + x
    };
};

var solution = R.pipe(parseInput, makeCycle, R.reduceWhile(isUnknownFreq, addKnownFreq, {current: 0, set: {}}), R.prop("current"));

module.exports = solution;