var R = require('ramda');
var aStar = require('../a-star');

var numRegex = /(\d+)/g;
var parseInput = R.pipe(R.trim, R.match(numRegex), R.map(parseInt), R.zipObj(['depth', 'x', 'y']));

// terrain
var terrains = { rocky: 0, wet: 1, narrow: 2 };
var getKey = (depth, target, coords) => `${coords.x},${coords.y}`;
var getGeoIndex = (depth, target, coords) => {
    if (coords.x === 0 && coords.y === 0) return 0;
    if (coords.x === target.x && coords.y === target.y) return 0;
    if (coords.y === 0) return coords.x * 16807;
    if (coords.x === 0) return coords.y * 48271;
    return getErosionLevel(depth, target, {x: coords.x - 1, y: coords.y}) * getErosionLevel(depth, target, {x: coords.x, y: coords.y - 1});
};
var getErosionLevel = R.memoizeWith(getKey, (depth, target, coords) => (getGeoIndex(depth, target, coords) + depth) % 20183);
var getTerrain = R.memoizeWith(getKey, (depth, target, coords) => getErosionLevel(depth, target, coords) % 3);

// movement
var dirs = [{x: 0, y: -1}, {x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}];
var step = (pos, dir) => ({x: pos.x + dir.x, y: pos.y + dir.y});
var isInBounds = pos => 0 <= pos.x && 0 <= pos.y;
var manhattan = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

// tools
var tools = { neither: 0, torch: 1, gear: 2 };
var isValidTools = (tool, terrain) => (terrain === terrains.rocky && (tool === tools.torch || tool === tools.gear)) 
                                || (terrain === terrains.wet && (tool === tools.neither || tool === tools.gear))
                                || (terrain === terrains.narrow && (tool === tools.neither || tool === tools.torch));

var run = input => {
    var depth = input.depth;
    var target = {x: input.x, y: input.y};

    var start = {pos: {x: 0, y: 0}, t: 0, tool: tools.torch };
    var isEnd = i => i.pos.x === target.x && i.pos.y === target.y && i.tool === tools.torch;
    var getNeighbors = function* (i) {
        for(var dir of dirs) {
            var nextPos = step(i.pos, dir);
            if (!isInBounds(nextPos)) continue;
            var nextTerrain = getTerrain(depth, target, nextPos);
            if (!isValidTools(i.tool, nextTerrain)) continue;
            yield {pos: nextPos, t: i.t + 1, tool: i.tool, terrain: nextTerrain, last: i};
        }

        var terrain = getTerrain(depth, target, i.pos);
        for(var tool of R.values(tools)) {
            if (tool === i.tool) continue;
            if (!isValidTools(tool, terrain)) continue;
            yield {pos: i.pos, t: i.t + 7, tool: tool, terrain: terrain, last: i};
        }
    };
    var getCost = i => i.t;
    var getHeuristic = i => manhattan(i.pos, target);
    var getKey = i => `${i.pos.x},${i.pos.y},${i.tool}`;

    var result = aStar(start, isEnd, getNeighbors, getCost, getHeuristic, getKey);

    return result.t;
}

var solution = R.pipe(parseInput, run);

module.exports = solution;