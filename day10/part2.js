var R = require('ramda');

var lineRegex = /position=<\s*(-?\d+),\s*(-?\d+)> velocity=<\s*(-?\d+),\s*(-?\d+)>/;
var parseLine = R.pipe(R.match(lineRegex), R.tail, R.map(parseInt), R.zipObj(['x', 'y', 'vx', 'vy']));
var parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseLine));

var updateLight = light => {
    light.x += light.vx;
    light.y += light.vy;
};

var max = R.reduce(R.max, -Infinity);
var min = R.reduce(R.min, Infinity)
var conditional = lights => {
    var ys = R.map(R.prop('y'), lights);
    return max(ys) - min(ys) > 9;
}

var simulateLights = lights => {
    var t = 0;
    while (conditional(lights)) {
        t++;
        for(var light of lights) {
            updateLight(light);
        }
    }
    return t;
}

var solution = R.pipe(parseInput, simulateLights);

module.exports = solution;