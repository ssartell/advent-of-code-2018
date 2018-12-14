var R = require('ramda');
var debug = x => { debugger; return x; };

var parseInput = R.pipe(R.trim, parseInt);

var nextRecipe = (elf, score) => {
    for(var i = 0; i <= score; i++) {
        elf = elf.next;
    }
    return elf;
};

var addRecipe = (last, score) => {
    var recipe = { score: score, i: last.i + 1, next: last.next, prev: last };
    last.next = recipe;
    last = recipe;
};

var solve = input => {
    var first = { score: 3, i: 1 };
    var second = { score: 7, i: 2 };
    first.next = second;
    first.prev = second;
    second.next = first;
    second.prev = first;

    var elf1 = first;
    var elf2 = second;
    var last = second;
    while (true) {
        var elf1Score = elf1.score;
        var elf2Score = elf2.score
        var sum = elf1Score + elf2Score;
        var ones = sum % 10;
        var tens = (sum - ones) / 10;

        if (tens) {
            last = addRecipe(last, tens);
            last = addRecipe(last, ones);
        } else {
            last = addRecipe(last, ones);
        }
        
        elf1 = nextRecipe(elf1, elf1Score);
        elf2 = nextRecipe(elf2, elf2Score);
    }
}

var solution = R.pipe(parseInput, solve);

module.exports = solution;