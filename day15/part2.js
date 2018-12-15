var R = require('ramda');
var Queue = require('mnemonist/queue');
var debug = x => { debugger; return x; };
var hp = 200;
var dirs = [{x: 0, y: -1}, {x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}];

var parseInput = R.pipe(R.trim, R.split('\n'), R.map(R.pipe(R.trim, R.split(''))));

var toState = (input, elfAp) => {
    var map = R.repeat(0, input.length).map(x => R.repeat(0, input[0].length));
    var units = [];

    for(var y = 0; y < input.length; y++) {
        for(var x = 0; x < input[0].length; x++) {
            var type = input[y][x];
            if (type === '#' || type === '.') {
                map[y][x] = {type, x, y};
            } else if (type === 'E') {
                var unit = {type, x, y, hp, ap: elfAp};
                units.push(unit);
                map[y][x] = unit;
            } else if (type === 'G') {
                var unit = {type, x, y, hp, ap: 3};
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
var clearSpace = (map, unit) => map[unit.y][unit.x] = {type: '.', x: unit.x, y: unit.y};
var neightbors = (map, unit) => R.map(dir => map[unit.y + dir.y][unit.x + dir.x], readingOrder(dirs));
var adjacentSpaces = (map, unit) => R.filter(isSpace, neightbors(map, unit));
var keyOfSpace = space => `${space.x},${space.y}`;

var shorestPathToReachable = (map, unit) => {
    var queue = Queue.from(adjacentSpaces(map, unit).map(R.of));
    var seen = new Set();
    var foundPaths = [];
    while(queue.peek()) {
        var path = queue.dequeue();
        if (foundPaths.length > 0 && path.length > foundPaths[0].path.length) break;
        
        var lastSpace = R.last(path);
        var key = keyOfSpace(lastSpace);
        if (seen.has(key)) continue;
        seen.add(key);
        
        if (anyEnemiesAlive(unit.type, neightbors(map, lastSpace))) {
            foundPaths.push({path, x: lastSpace.x, y: lastSpace.y});
        } else {
            for(var space of adjacentSpaces(map, lastSpace)) {
                queue.enqueue(Array.from(path).concat([space]));        
            }
        }        
    }

    return R.isEmpty(foundPaths) ? [] : R.pipe(readingOrder, R.head, R.prop('path'))(foundPaths);
};

var shouldMove = (map, units, unit) => anyEnemiesAlive(unit.type, units) && !anyEnemiesAlive(unit.type, neightbors(map, unit));
var move = (map, unit) => {
    var spaceToMoveTo = R.head(shorestPathToReachable(map, unit));
    if (!spaceToMoveTo) return;
    clearSpace(map, unit);
    unit.x = spaceToMoveTo.x;
    unit.y = spaceToMoveTo.y;
    map[unit.y][unit.x] = unit;
};

var canAttack = (map, units, unit) => anyEnemiesAlive(unit.type, units) && anyEnemiesAlive(unit.type, neightbors(map, unit));
var attack = (map, unit) => {
    var enemy = R.pipe(thatAreEnemies(unit.type), thatAreAlive, R.sortBy(R.prop('hp')), R.head)(neightbors(map, unit));
    enemy.hp -= unit.ap;
    if (!stillAlive(enemy)) clearSpace(map, enemy);
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
var allElvesAlive = R.pipe(R.filter(isElf), R.all(stillAlive));

var run = (init, doPrint) => {
    var units = init.units;
    var map = init.map;

    var i = 0;   
    var fight = true;
    if (doPrint) {
        print(map, i, hpOfRemaningUnits(units));
    }
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
        if (doPrint) {
            print(map, i, hpOfRemaningUnits(units));
        }
    } while (fight && anyEnemiesAlive('G', units) && anyEnemiesAlive('E', units))

    return {
        allElvesAlive: allElvesAlive(units),
        outcome: i * hpOfRemaningUnits(units)
    };
}

var timeMachine = input => {
    var elfAp = 1;
    while(true) {
        var result = run(toState(input, elfAp), elfAp === 14);
        if (result.allElvesAlive) 
            return result.outcome;
        elfAp++;
    }
}

var solution = R.pipe(parseInput, timeMachine);

module.exports = solution;