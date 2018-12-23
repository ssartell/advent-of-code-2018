var R = require('ramda');
var Heap = require('mnemonist/heap');

var numRegex = /(\d+)/g;
var parseInput = R.pipe(R.trim, R.match(numRegex), R.map(parseInt), R.zipObj(['depth', 'x', 'y']));

var isRocky = x => x === 0;
var isWet = x => x === 1;
var isNarrow = x => x === 2;

var dirs = [{x: 0, y: -1}, {x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}];
var step = (pos, dir) => ({x: pos.x + dir.x, y: pos.y + dir.y});
var isInBounds = pos => 0 <= pos.x && 0 <= pos.y
var manhattan = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

var toolCombos = [
    {torch: true, gear: false},
    {torch: true, gear: true},
    {torch: false, gear: false},
    {torch: false, gear: true}
];
var neither = tools => !tools.torch && !tools.gear;
var isValidTools = (tools, type) => (isRocky(type) && (tools.torch || tools.gear) && !neither(tools)) 
                                || (isWet(type) && (tools.gear || neither(tools)) && !tools.torch) 
                                || (isNarrow(type) && (tools.torch || neither(tools)) && !tools.gear);

var getKey = (depth, target, coords) => `${coords.x},${coords.y}`;
var getGeoIndex = (depth, target, coords) => {
    if (coords.x === 0 && coords.y === 0) return 0;
    if (coords.x === target.x && coords.y === target.y) return 0;
    if (coords.y === 0) return coords.x * 16807;
    if (coords.x === 0) return coords.y * 48271;
    return getErosionLevel(depth, target, {x: coords.x - 1, y: coords.y}) * getErosionLevel(depth, target, {x: coords.x, y: coords.y - 1});
};
var getErosionLevel = R.memoizeWith(getKey, (depth, target, coords) => (getGeoIndex(depth, target, coords) + depth) % 20183);
var getType = R.memoizeWith(getKey, (depth, target, coords) => getErosionLevel(depth, target, coords) % 3);

var aStar = (start, isEnd, getNeighbors, g, h, getKey) => {
    var heap = new Heap(R.comparator((a, b) => g(a) + h(a) <= g(b) + h(b)));
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

var run = input => {
    var depth = input.depth;
    var target = {x: input.x, y: input.y};

    var start = {pos: {x: 0, y: 0}, t: 0, tools: {torch: true, gear: false}};
    var isEnd = i => i.pos.x === target.x && i.pos.y === target.y && i.tools.torch;
    var getNeighbors = function* (i) {
        for(var dir of dirs) {
            var nextPos = step(i.pos, dir);
            if (!isInBounds(nextPos)) continue;
            var nextType = getType(depth, target, nextPos);
            if (!isValidTools(i.tools, nextType)) continue;
            yield {pos: nextPos, t: i.t + 1, tools: i.tools, type: nextType, last: i};
        }

        var type = getType(depth, target, i.pos);
        for(var tools of toolCombos) {
            if (!isValidTools(tools, type)) continue;
            yield {pos: i.pos, t: i.t + 7, tools: tools, type: type, last: i};
        }
    };
    var getCost = i => i.t;
    var getHeuristic = i => manhattan(i.pos, target);
    var getKey = i => `${i.pos.x},${i.pos.y},${i.tools.torch},${i.tools.gear}`;

    var result = aStar(start, isEnd, getNeighbors, getCost, getHeuristic, getKey);

    return result.t;
}

var solution = R.pipe(parseInput, run);

module.exports = solution;