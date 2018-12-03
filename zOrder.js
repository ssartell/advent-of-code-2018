var R = require('ramda');

function xy2d(x, y) {
    return part1by1(x) | (part1by1(y) << 1);
}


function d2xy(n) {
    return [unpart1by1(n), unpart1by1(n >> 1)];
}

function part1by1(n) {
    n &= 0x0000ffff
    n = (n | (n << 8)) & 0x00FF00FF;
    n = (n | (n << 4)) & 0x0F0F0F0F;
    n = (n | (n << 2)) & 0x33333333;
    n = (n | (n << 1)) & 0x55555555;
    return n;
}

function unpart1by1(n) {
    n &= 0x55555555;
    n = (n ^ (n >> 1)) & 0x33333333;
    n = (n ^ (n >> 2)) & 0x0f0f0f0f;
    n = (n ^ (n >> 4)) & 0x00ff00ff;
    n = (n ^ (n >> 8)) & 0x0000ffff;
    return n;
}

module.exports = {
    d2xy: R.curry(d2xy),
    xy2d: R.curry(xy2d)
};