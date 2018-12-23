var R = require('ramda');
var Heap = require('mnemonist/heap');

module.exports = (start, isEnd, getNeighbors, g, h, getKey) => {
    var f = x => g(x) + h(x);
    var heap = new Heap(R.comparator((a, b) => f(a) <= f(b)));
    heap.push(start);
    var seen = new Set();
    while(heap.peek()) {
        var current = heap.pop();
        var key = getKey(current);
        if (seen.has(key)) continue;
        seen.add(key);
        if (isEnd(current)) return current;
        for(var neighbor of getNeighbors(current)) {
            heap.push(neighbor);
        }
    }
};