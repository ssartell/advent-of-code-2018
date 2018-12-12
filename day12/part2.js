var R = require('ramda');
var debug = x => { debugger; return x; };

var initRegex = /initial state: ((?:#|\.)*)/;
var parseInit = R.pipe(R.match(initRegex), R.tail, R.head, R.split(''));
var rulesRegex = /((?:#|\.)*) => (#|\.)/;
var parseRule = R.pipe(R.trim, R.match(rulesRegex), R.tail, R.zipObj(['condition', 'result']));
var parseInput = R.pipe(R.trim, R.split('\n\r'), x => ({init: parseInit(x[0]), rules: R.pipe(R.trim, R.split('\n'), R.map(parseRule))(x[1])}));

var plantToBit = x => x === '#' ? 1 : 0;

var getLens = function* (arr) {
    var lens = 0;
    for(var i = 0; i < arr.length; i++) {
        lens = ((lens << 1) | arr[i]) & 31;
        yield lens;
    }

    for(var i = 1; i < 5; i++) {
        lens = ((lens << 1) | 0) & 31;
        yield lens;
    }
}

var nextGen = (lastGen, rules) => {
    var newGen = [];
    for(var lens of getLens(lastGen)) {
        newGen.push(rules[lens]);
    }
    return newGen;
}

var solve = input => {
    var currentGen = R.map(plantToBit, input.init);
    
    var rules = R.repeat(0, 32);
    for(var rule of input.rules) {
        var digit = 0;
        for(var x of rule.condition) {
            digit = digit << 1;
            if (x === '#') {
                digit = digit | 1;
            }
        }
        rules[digit] = plantToBit(rule.result);
    }

    var leftIndex = 0;
    for(var i = 1; i <= 162; i++) {
        currentGen = nextGen(currentGen, rules);
        leftIndex -= 2;
    }

    return R.pipe(R.addIndex(R.map)((x, i) => x === 1 ? i + leftIndex : 0), R.sum)(currentGen) + (50000000000 - 162) * 23;
}

var solution = R.pipe(parseInput, solve);

module.exports = solution;