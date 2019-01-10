var R = require('ramda');
var Heap = require('mnemonist/heap');

module.exports = (start, isEnd, getNeighbors, g, h, getKey = x => x) => {
    var notVisited = new Heap(R.comparator((a, b) => g(a) + h(a) <= g(b) + h(b)));
    notVisited.push(start);
    var seen = new Set();
    while(notVisited.peek()) {
        var current = notVisited.pop();
        var key = getKey(current);
        if (seen.has(key)) continue;
        seen.add(key);
        if (isEnd(current)) return current;
        for(var neighbor of getNeighbors(current)) {
            notVisited.push(neighbor);
        }
    }
};