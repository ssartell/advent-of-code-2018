var R = require('ramda');
var Heap = require('mnemonist/heap');

module.exports = (start, isEnd, getNeighbors, getCost, getKey) => {
    var notVisited = new Heap(R.comparator((a, b) => getCost(a) <= getCost(b)));
    notVisited.push(start);
    var costs = new Map();
    while(notVisited.peek()) {
        var current = notVisited.pop();
        var key = getKey(current);
        var cost = getCost(current);
        if (costs.has(key) && cost >= costs.get(key)) 
            continue;
        costs.set(key, cost);
        if (isEnd(current)) return current;
        for(var neighbor of getNeighbors(current)) {
            notVisited.push(neighbor);
        }
    }
};