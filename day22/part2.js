var R = require('ramda');
var aStar = require('../a-star');

var numRegex = /(\d+)/g;
var parseInput = R.pipe(R.trim, R.match(numRegex), R.map(parseInt), R.zipObj(['depth', 'x', 'y']));

// terrain
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

// movement
var dirs = [{x: 0, y: -1}, {x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}];
var step = (pos, dir) => ({x: pos.x + dir.x, y: pos.y + dir.y});
var isInBounds = pos => 0 <= pos.x && 0 <= pos.y
var manhattan = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

// tools
var toolCombos = [{torch: true, gear: false}, {torch: true, gear: true}, {torch: false, gear: false}, {torch: false, gear: true}];
var neither = tools => !tools.torch && !tools.gear;
var isValidTools = (tools, type) => (type === 0 && (tools.torch || tools.gear) && !neither(tools)) 
                                || (type === 1 && (tools.gear || neither(tools)) && !tools.torch) 
                                || (type === 2 && (tools.torch || neither(tools)) && !tools.gear);

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