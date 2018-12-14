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
    return recipe;
};

var solve = input => {
    var elf1 = { score: 3, i: 1 };
    var elf2 = { score: 7, i: 2, next: elf1, prev: elf1 };
    elf1.next = elf2;
    elf1.prev = elf2;
    var last = elf2;

    while (true) {
        var score1 = elf1.score;
        var score2 = elf2.score
        var sum = score1 + score2;
        var ones = sum % 10;
        var tens = (sum - ones) / 10;

        if (tens) {
            last = addRecipe(last, tens);
        }
        last = addRecipe(last, ones);

        if (last.i >= input + 10) {
            var str = '';
            var recipe = last;
            while (recipe.i > input) {
                str = recipe.score + str;
                recipe = recipe.prev;
            }
            return str.substring(0, 10);
        }
        
        elf1 = nextRecipe(elf1, score1);
        elf2 = nextRecipe(elf2, score2);
    }
}

var solution = R.pipe(parseInput, solve);

module.exports = solution;