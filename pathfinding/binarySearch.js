var R = require('ramda');

module.exports = (left, right, getMidpoint, isRight, isEqual) => {
    while (!isEqual(left, right)) {
        var middle = getMidpoint(left, right);
        if (isRight(middle)) {
            right = middle;
        } else {
            left = middle;
        }
    }
    return right;
};