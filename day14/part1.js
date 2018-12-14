var R = require('ramda');
var debug = x => { debugger; return x; };

var parseInput = R.pipe(R.trim, parseInt);

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

        if (tens !== 0) {
            var recipe2 = { score: ones, i: last.i + 2, next: first };
            var recipe1 = { score: tens, i: last.i + 1, next: recipe2, prev: last };
            recipe2.prev = recipe1;
            last.next = recipe1;
            last = recipe2;
        } else {
            var recipe1 = { score: ones, i: last.i + 1, next: last.next, prev: last };
            last.next = recipe1;
            last = recipe1;
        }

        if (last.i >= input + 10) {
            var str = '';
            var recipe = last;
            while (recipe.i > input) {
                str = recipe.score + str;
                recipe = recipe.prev;
            }
            return str.substring(0, 10);
        }
        
        for(var i = 0; i <= elf1Score; i++) {
            elf1 = elf1.next;
        }

        for(var i = 0; i <= elf2Score; i++) {
            elf2 = elf2.next;
        }
    }
}

var solution = R.pipe(parseInput, solve);

module.exports = solution;