var R = require('ramda');

var lineRegex = /(.+) players; last marble is worth (.+) points/;
var parseInput = R.pipe(R.trim, R.match(lineRegex), R.tail, R.map(parseInt), R.zipObj(['players', 'lastMarble']));

var placeMarble = (current, i) => {
    var left = current.next;
    var right = left.next;
    var marble = {
        i,
        prev: left,
        next: right
    };
    left.next = marble;
    right.prev = marble;
    return marble;
};

var removeMarble = (current) => {
    for(var i = 0; i < 7; i++) {
        current = current.prev;
    }
    var left = current.prev;
    var right = current.next;
    left.next = right;
    right.prev = left;
    return { newCurrent: right, score: current.i };
};

var isMultipleOf23 = x => x % 23 === 0;

var playGame = opts => {
    var current = {i: 0};
    current.next = current;
    current.prev = current;

    var playersScores = R.repeat(0, opts.players);
    var playerIndex = 0;
    for(var i = 1; i <= opts.lastMarble; i++) {
        if (isMultipleOf23(i)) {
            playersScores[playerIndex] += i;
            var { newCurrent, score } = removeMarble(current);
            playersScores[playerIndex] += score;
            current = newCurrent;
        } else {
            current = placeMarble(current, i);
        }

        playerIndex = (playerIndex + 1) % opts.players;
    }

    return R.reduce(R.max, -Infinity, playersScores);
};

var solution = R.pipe(parseInput, R.evolve({ lastMarble: x => x * 100}), playGame);

module.exports = solution;