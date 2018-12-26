var R = require('ramda');
var Heap = require('mnemonist/heap');

module.exports = (start, isEnd, getNeighbors, getCost, getKey) => {
    var notVisited = new Heap(R.comparator((a, b) => getCost(a) <= getCost(b)));
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