var R = require('ramda');

var asRing = function* (arr) {
    while(true)
        for(var x of arr)
            yield x;
};

var parseInput = R.pipe(R.trim, R.split(/, |\n/), R.map(parseInt));

var solution = input => {
    var freqs = new Set([0]);
    var acc = 0;
    for(var x of asRing(parseInput(input))) {
        acc += x;
        if (freqs.has(acc)) return acc;
        freqs.add(acc);
    }
}

module.exports = solution;