var R = require('ramda');
var Queue = require('mnemonist/queue');
var dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];

var lineRegex = /(\d+), (\d+)/;
var parseLine = R.pipe(R.match(lineRegex), R.tail, R.map(parseInt), R.zipObj(['x', 'y']));
var parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseLine));

var min = R.reduce(R.min, Infinity);
var max = R.reduce(R.max, -Infinity);
var manhattan = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
var inBounds = R.curry((minX, maxX, minY, maxY, loc) => minX <= loc.x && loc.x <= maxX && minY <= loc.y && loc.y <= maxY);
var onBounds = R.curry((minX, maxX, minY, maxY, loc) => loc.x === minX || loc.x === maxX || loc.y === minY || loc.y === maxY);
var biggestArea = R.pipe(R.map(R.prop('count')), R.filter(x => x < Infinity), max);

var solve = coords => {
    var xs = R.map(R.prop('x'), coords);
    var ys = R.map(R.prop('y'), coords);
    var [minX, maxX, minY, maxY] = [min(xs), max(xs), min(ys), max(ys)];
    var isInBounds = inBounds(minX, maxX, minY, maxY);
    var isOnBounds = onBounds(minX, maxX, minY, maxY);
    var seen = {};

    var q = new Queue();
    R.forEach(coord => q.enqueue({x: coord.x, y: coord.y, dist: 0, coord: coord}), coords);

    while(q.peek()) {
        var loc = q.dequeue();
        if (!isInBounds(loc)) continue;

        var key = `${loc.x},${loc.y}`;
        var prevSeen = seen[key];

        if (prevSeen) {
            if (prevSeen.coord){
                if (loc.coord !== prevSeen.coord && loc.dist === prevSeen.dist) {
                    prevSeen.coord.count--;
                    prevSeen.coord = null;
                }
            }            
            continue;
        } else {
            loc.coord.count = isOnBounds(loc) ? Infinity : (loc.coord.count || 0) + 1;
            seen[key] = { dist: loc.dist, coord: loc.coord };
        }

        for(var dir of dirs) {
            q.enqueue({x: loc.x + dir[0], y: loc.y + dir[1], dist: loc.dist + 1, coord: loc.coord});
        }
    }

    return coords;
};

var solution = R.pipe(parseInput, solve, biggestArea);

module.exports = solution;