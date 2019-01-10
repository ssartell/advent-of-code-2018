var R = require('ramda');

var lineRegex = /(\d+) units each with (\d+) hit points(?: \((?:(\w+) to ([\w\s,]+))(?:; )?(?:(\w+) to ([\w\s,]+))?\))? with an attack that does (\d+) (\w+) damage at initiative (\d+)/;
var toGroup = x => {
    var group = {
        units: parseInt(x[0]),
        hitPoints: parseInt(x[1]),
        attackPower: parseInt(x[6]),
        weak: [],
        immune: [],
        attackType: x[7],
        initiative: parseInt(x[8])
    };
    if (x[2]) group[x[2]] = R.split(', ', x[3]);
    if (x[4]) group[x[4]] = R.split(', ', x[5]);
    return group;
}
var parseLine = R.pipe(R.match(lineRegex), R.tail, toGroup);
var parseInput = R.pipe(R.trim, R.split('\r\n\r\n'), R.map(R.pipe(R.split('\n'), R.tail, R.map(parseLine))));

var effectivePower = group => group.units * group.attackPower;
var isImmuneTo = (attackType, defender) => R.contains(attackType, defender.immune);
var isWeakTo = (attackType, defender) => R.contains(attackType, defender.weak);
var damageDealt = R.curry((attacker, defender) => {
    if (isImmuneTo(attacker.attackType, defender)) {
        return 0;
    } else if (isWeakTo(attacker.attackType, defender)) {
        return effectivePower(attacker) * 2;
    } else {
        return effectivePower(attacker);
    }
});
var canTakeDamageFrom = R.curry((attacker, defender) => damageDealt(attacker, defender) > 0);
var isEnemyOf = R.curry((a, b) => a.team !== b.team);
var hasUnits = group => group.units > 0;

var selectionOrder = R.sortWith([R.descend(effectivePower), R.descend(x => x.initiative)]);
var targetSort = R.curry((attacker, groups) => R.sortWith([R.descend(damageDealt(attacker)), R.descend(effectivePower), R.descend(x => x.initiative)])(groups));
var selectTargetFrom = (attacker, groups) => R.pipe(R.filter(hasUnits), R.filter(isEnemyOf(attacker)), R.filter(canTakeDamageFrom(attacker)), targetSort(attacker), R.head)(groups);
var getTargetSelection = groups => {
    var selections = new Map();
    var unselected = groups;
    for(var attacker of selectionOrder(groups)) {
        if (!hasUnits(attacker)) continue;
        var target = selectTargetFrom(attacker, unselected);
        if (!target) continue;
        selections.set(attacker, target);
        unselected = R.without([target], unselected);
    }
    return selections;
};

var attackingOrder = R.sortWith([R.descend(x => x.initiative)]);
var attack = (groups, targets) => {
    for(var attacker of attackingOrder(groups)) {
        if (!hasUnits(attacker)) continue;
        if (!targets.has(attacker)) continue;
        var defender = targets.get(attacker);
        if (!hasUnits(defender)) continue;
        var damage = damageDealt(attacker, defender);
        defender.units -= Math.floor(damage / defender.hitPoints);
    }
};

var sumOfUnits = R.pipe(R.filter(hasUnits), R.map(x => x.units), R.sum);

var doesImmuneSystemWin = (boost, input) => {
    var teams = parseInput(input);
    var immuneSystem = R.forEach(x => {
        x.team = 'immuneSystem';
        x.attackPower += boost;
    }, teams[0]);
    var infection = R.forEach(x => x.team = 'infection', teams[1]);
    var allGroups = R.concat(immuneSystem, infection);
    
    var totalUnits = sumOfUnits(allGroups);
    var lastTotalUnits = null;
    while (R.any(hasUnits, infection) && R.any(hasUnits, immuneSystem) && lastTotalUnits !== totalUnits) {
        var targets = getTargetSelection(allGroups);
        if (targets.size === 0) break;
        attack(allGroups, targets);
        lastTotalUnits = totalUnits;
        totalUnits = sumOfUnits(allGroups);
    }

    return { 
        boost: boost,
        isSuccess: !R.any(hasUnits, infection),
        units: R.pipe(R.filter(hasUnits), R.map(x => x.units), R.sum)(immuneSystem)
    };
};

var run = input => {
    var i = 0;
    while(true) {
        var result = doesImmuneSystemWin(i, input);
        if (result.isSuccess) return result.units;
        i++;
    }
};

var solution = R.pipe(run);

module.exports = solution;