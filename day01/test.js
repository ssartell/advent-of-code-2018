var assert = require('assert');

describe('day01', function() {
    describe('part 1', function() {
        var part1 = require('./part1');
        it('test1', function() {
            assert.equal(part1("+1, +1, +1"), 3);
        });
        it('test2', function() {
            assert.equal(part1("+1, +1, -2"), 0);
        });
        it('test3', function() {
            assert.equal(part1("-1, -2, -3"), -6);
        });
    });
    
    describe('part 2', function() {
        var part2 = require('./part2');
        it('test1', function() {
            assert.equal(part2("+1, -1"), 0);
        });
        it('test2', function() {
            assert.equal(part2("+3, +3, +4, -2, -4"), 10);
        });
        it('test3', function() {
            assert.equal(part2("-6, +3, +8, +5, -6"), 5);
        });
        it('test4', function() {
            assert.equal(part2("+7, +7, -2, -7, -4"), 14);
        });
    });
});