var R = require('ramda');
var Stack = require('mnemonist/stack');

module.exports = (start, isEnd, getNeighbors, getKey = x => x) => {
    var notVisited = new Stack();
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