var R = require('ramda');
var debug = x => { debugger; return x; };

var initRegex = /initial state: ((?:#|\.)*)/;
var parseInit = R.pipe(R.match(initRegex), R.tail, R.head, R.split(''));
var rulesRegex = /((?:#|\.)*) => (#|\.)/;
var parseRule = R.pipe(R.trim, R.match(rulesRegex), R.tail, R.zipObj(['condition', 'result']));
var parseInput = R.pipe(R.trim, R.split('\n\r'), x => ({init: parseInit(x[0]), rules: R.pipe(R.trim, R.split('\n'), R.map(parseRule))(x[1])}));

var blanks = '....';
var getLens = function* (arr) {
    var lens = blanks;
    for(var i = 0; i < arr.length; i++) {
        lens += arr[i];
        if (lens.length > 5) {
            lens = lens.substr(-5);
        }
        if (lens.length === 5) {
            yield lens;
        }
    }

    for(var i = 1; i < 5; i++) {
        yield lens.substr(i) + blanks.substr(-i);
    }
}

var nextGen = (lastGen, rules) => {
    var newGen = [];
    for(var lens of getLens(lastGen)) {
        newGen.push(rules.has(lens) ? rules.get(lens) : 0);
    }
    return newGen;
}

var solve = input => {
    var currentGen = input.init;
    var rules = new Map();

    for (var rule of input.rules) {
        rules.set(rule.condition, rule.result);
    }

    var leftIndex = 0;
    for(var i = 1; i <= 20; i++) {
        currentGen = nextGen(currentGen, rules);
        leftIndex -= 2;
    }

    return R.pipe(R.addIndex(R.map)((x, i) => x === '#' ? i + leftIndex : 0), R.sum)(currentGen);
}

var solution = R.pipe(parseInput, solve);

module.exports = solution;