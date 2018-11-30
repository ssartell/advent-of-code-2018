var assert = require('assert');
var S = require('./sets');

describe('sets', function() {
    describe('isSuperset', function() {
        it('empty sets', function() {
            assert.equal(S.isSuperset(new Set([]), new Set([])), true);
        });
        it('equal sets', function() {
            assert.equal(S.isSuperset(new Set([1]), new Set([1])), true);
        });
        it('sets', function() {
            assert.equal(S.isSuperset(new Set([1, 2]), new Set([1])), true);
        });
        it('not superset', function() {
            assert.equal(S.isSuperset(new Set([1]), new Set([1, 2])), false);
        });
        it('not superset', function() {
            assert.equal(S.isSuperset(new Set([1, 2]), new Set([3])), false);
        });
    });

    describe('symmetricDifference', function() {
        it('yep', function() {
            assert.equal(S.symmetricDifference(new Set([1, 2]), new Set([3])), [1,2,3]);
        });
    });
});