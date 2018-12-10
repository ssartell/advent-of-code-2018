var R = require('ramda');
var ansi = require('ansi');
var cursor = ansi(process.stdout);

var lineRegex = /position=<\s*(-?\d+),\s*(-?\d+)> velocity=<\s*(-?\d+),\s*(-?\d+)>/;
var parseLine = R.pipe(R.match(lineRegex), R.tail, R.map(parseInt), R.zipObj(['x', 'y', 'vx', 'vy']));
var parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseLine));

var updateLight = light => {
    light.x += light.vx;
    light.y += light.vy;
};

var max = R.reduce(R.max, -Infinity);
var min = R.reduce(R.min, Infinity)
var withinRange = lights => {
    var ys = R.map(R.prop('y'), lights);
    return max(ys) - min(ys) > 9;
}

var simulateLights = lights => {
    while (withinRange(lights)) {
        for(var light of lights) {
            updateLight(light);
        }
    }
    return lights;
}

var draw = lights => {
    // cls
    process.stdout.write('\u001B[2J\u001B[0;0f');

    var ys = R.map(R.prop('y'), lights);
    var xs = R.map(R.prop('x'), lights);
    var minX = min(xs);
    var minY = min(ys);
    for(var light of lights) {
        cursor.goto(light.x - minX, light.y - minY).write('#');
    }

    cursor.goto(0, 10);
};

var solution = R.pipe(parseInput, simulateLights, draw);

module.exports = solution;