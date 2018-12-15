var R = require('ramda');
var Queue = require('mnemonist/queue');
var ansi = require('ansi');
var cursor = ansi(process.stdout);
var debug = x => { debugger; return x; };
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
var areSameTeam = R.curry((type, unit) => isUnit(unit) && unit.type === type);
var areEnemies = R.curry((type, unit) => isUnit(unit) && unit.type !== type);
var stillAlive = unit => unit.hp > 0;

var neightbors = function (map, unit) {
    var spaces = [];
    for(var dir of readingOrder(dirs)) {
        spaces.push(map[unit.y + dir.y][unit.x + dir.x]);
    }
    return spaces;
};

var thatAreEnemies = R.curry((type, units) => R.filter(areEnemies(type))(units));
var thatAreAlive = R.filter(stillAlive);
var anyEnemiesAlive = (type, units) => R.pipe(thatAreEnemies(type), thatAreAlive, R.isEmpty, R.not)(units);
var adjacentSpace = (map, unit) => R.filter(x => x.type === '.', neightbors(map, unit));

var shouldMove = (map, units, unit) => anyEnemiesAlive(unit.type, units) && !anyEnemiesAlive(unit.type, neightbors(map, unit));

var keyOfSpace = space => `${space.x},${space.y}`;
var shorestPathToReachable = (map, unit) => {
    var queue = new Queue();
    var seen = new Set();
    for(var space of adjacentSpace(map, unit)) {
        queue.enqueue([space]);
        seen.add(keyOfSpace(space));
    }

    var allPaths = [];
    var dist = Infinity;
    while(queue.peek()) {
        var path = queue.dequeue();
        var currentSpace = R.last(path);
        if (path.length > dist) 
            break;

        if (anyEnemiesAlive(unit.type, neightbors(map, currentSpace))) {
            allPaths.push({path, x: currentSpace.x, y: currentSpace.y});
            dist = path.length;
        } else {
            for(var space of adjacentSpace(map, currentSpace)) {
                var key = keyOfSpace(space);
                if (!seen.has(key)) {
                    var newPath = Array.from(path);
                    newPath.push(space);
                    queue.enqueue(newPath);
                    seen.add(keyOfSpace(space));
                }            
            }
        }        
    }

    //return [];
    if (R.isEmpty(allPaths)) {
        return [];
    } else {
        return R.pipe(readingOrder, R.head, R.prop('path'))(allPaths);
    }
};

var move = (map, unit) => {
    var spaceToMoveTo = R.head(shorestPathToReachable(map, unit));
    if (!spaceToMoveTo) return;
    map[unit.y][unit.x] = {type: '.', x: unit.x, y: unit.y};
    unit.x = spaceToMoveTo.x;
    unit.y = spaceToMoveTo.y;
    map[unit.y][unit.x] = unit;
};

var canAttack = (map, units, unit) => {
    return anyEnemiesAlive(unit.type, units) && anyEnemiesAlive(unit.type, neightbors(map, unit))
};

var sortByHp = R.sortBy(R.prop('hp'));
var attack = (map, unit) => {
    var enemy = R.pipe(thatAreEnemies(unit.type), thatAreAlive, sortByHp, R.head)(neightbors(map, unit));
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