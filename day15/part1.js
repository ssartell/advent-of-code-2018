var R = require('ramda');
var Queue = require('mnemonist/queue');
var ap = 3;
var hp = 200;
var dirs = [{x: 0, y: -1}, {x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}];

var parseInput = R.pipe(R.trim, R.split('\n'), R.map(R.pipe(R.trim, R.split(''))));

var toState = input => {
    var map = R.repeat(0, input.length).map(x => R.repeat(0, input[0].length));
    var units = [];

    for(var y = 0; y < input.length; y++) {
        for(var x = 0; x < input[0].length; x++) {
            var type = input[y][x];
            if (type === '#' || type === '.') {
                map[y][x] = {type, x, y};
            } else if (type === 'E' || type === 'G') {
                var unit = {type, x, y, hp, ap};
                units.push(unit);
                map[y][x] = unit;
            }
        }
    }
    return {map, units};
};

var readingOrder = R.sortWith([R.ascend(R.prop('y')), R.ascend(R.prop('x'))]);
var isSpace = x => x.type === '.';
var isWall = x => x.type === '#';
var isElf = x => x.type === 'E';
var isGoblin = x => x.type === 'G';
var isUnit = x => isElf(x) || isGoblin(x);
var areEnemies = R.curry((type, unit) => isUnit(unit) && unit.type !== type);
var stillAlive = unit => unit.hp > 0;
var thatAreEnemies = R.curry((type, units) => R.filter(areEnemies(type))(units));
var thatAreAlive = R.filter(stillAlive);
var anyEnemiesAlive = (type, units) => R.pipe(thatAreEnemies(type), thatAreAlive, R.isEmpty, R.not)(units);
var neightbors = (map, unit) => R.map(dir => map[unit.y + dir.y][unit.x + dir.x], readingOrder(dirs));
var adjacentSpaces = (map, unit) => R.filter(isSpace, neightbors(map, unit));

var keyOfSpace = space => `${space.x},${space.y}`;
var shorestPathToReachable = (map, unit) => {
    var queue = new Queue();
    var seen = new Set();
    for(var space of adjacentSpaces(map, unit)) {
        queue.enqueue([space]);
        seen.add(keyOfSpace(space));
    }

    var allPaths = [];
    var dist = Infinity;
    while(queue.peek()) {
        var path = queue.dequeue();
        if (path.length > dist) break;

        var currentSpace = R.last(path);
        if (anyEnemiesAlive(unit.type, neightbors(map, currentSpace))) {
            allPaths.push({path, x: currentSpace.x, y: currentSpace.y});
            dist = path.length;
        } else {
            for(var space of adjacentSpaces(map, currentSpace)) {
                var key = keyOfSpace(space);
                if (seen.has(key)) continue;
                var newPath = Array.from(path);
                newPath.push(space);
                queue.enqueue(newPath);
                seen.add(keyOfSpace(space));        
            }
        }        
    }

    return R.isEmpty(allPaths) ? [] : R.pipe(readingOrder, R.head, R.prop('path'))(allPaths);
};

var shouldMove = (map, units, unit) => anyEnemiesAlive(unit.type, units) && !anyEnemiesAlive(unit.type, neightbors(map, unit));
var move = (map, unit) => {
    var nextStep = R.head(shorestPathToReachable(map, unit));
    if (!nextStep) return;
    map[unit.y][unit.x] = {type: '.', x: unit.x, y: unit.y};
    unit.x = nextStep.x;
    unit.y = nextStep.y;
    map[unit.y][unit.x] = unit;
};

var canAttack = (map, units, unit) => anyEnemiesAlive(unit.type, units) && anyEnemiesAlive(unit.type, neightbors(map, unit));
var attack = (map, unit) => {
    var enemy = R.pipe(thatAreEnemies(unit.type), thatAreAlive, R.sortBy(R.prop('hp')), R.head)(neightbors(map, unit));
    enemy.hp -= unit.ap;
    
    if (enemy.hp <= 0) {
        map[enemy.y][enemy.x] = {type: '.', x: enemy.x, y: enemy.y}
    }
};

var print = (map, i, hp) => {
    console.log('\n');
    console.log(`${i} * ${hp} = ${i * hp}`);
    for(var y = 0; y < map.length; y++) {
        var mapLine = map[y].map(x => x.type).join('');
        var health = map[y].filter(isUnit).map(x => ` ${x.type}(${x.hp})`).join('');
        console.log(`${mapLine} ${health}`);
    }
};

var hpOfRemaningUnits = R.pipe(thatAreAlive, R.map(R.prop('hp')), R.sum);

var run = init => {
    var units = init.units;
    var map = init.map;

    var i = 0;   
    var fight = true;
    print(map, i, hpOfRemaningUnits(units));
    do {
        for(var unit of readingOrder(units)) {
            if (!stillAlive(unit)) continue;
            if (!anyEnemiesAlive(unit.type, units)) {
                fight = false;
                break;
            }            
            if (shouldMove(map, units, unit)) {
                move(map, unit);
            }
            if (canAttack(map, units, unit)) {
                attack(map, unit);
            }
        }
        if (fight) {
            i++;
        }
        //print(map, i, hpOfRemaningUnits(units));
    } while (fight && anyEnemiesAlive('G', units) && anyEnemiesAlive('E', units))

    return i * hpOfRemaningUnits(units);
}

var solution = R.pipe(parseInput, toState, run);

module.exports = solution;