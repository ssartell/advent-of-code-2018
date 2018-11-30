var R = require('ramda');

var isSuperset = R.curry((setA, setB) => {
    for (var elem of setB) {
        if (!setA.has(elem)) {
            return false;
        }
    }
    return true;
});

var isSubset = R.curry(R.flip(isSuperset));

var union = R.curry((setA, setB) => {
    var union = new Set(setA);
    for (var elem of setB) {
        union.add(elem);
    }
    return union;
});

var intersection = R.curry((setA, setB) => {
    var intersection = new Set();
    for (var elem of setB) {
        if (setA.has(elem)) {
            intersection.add(elem);
        }
    }
    return intersection;
});

var difference = R.curry((setA, setB) => {
    var difference = new Set(setA);
    for (var elem of setB) {
        difference.delete(elem);
    }
    return difference;
});

var symmetricDifference = R.curry((setA, setB) => {
    return union(difference(setA, setB), difference(setB, setA));
});

module.exports = {
    isSuperset,
    isSubset,
    union,
    intersection,
    difference,
    symmetricDifference
};