var R = require('ramda');
var Queue = require('mnemonist/queue');

module.exports = (start, isEnd, getNeighbors, getKey = x => x) => {
    var notVisited = new Queue();
    notVisited.enqueue(start);
    var seen = new Set();
    while(notVisited.peek()) {
        var current = notVisited.dequeue();
        var key = getKey(current);
        if (seen.has(key)) continue;
        seen.add(key);
        if (isEnd(current)) return current;
        for(var neighbor of getNeighbors(current)) {
            notVisited.enqueue(neighbor);
        }
    }
};