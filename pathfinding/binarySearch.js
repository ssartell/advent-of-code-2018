module.exports = (left, right, getMidpoint, comparatorToTarget, timeout = Infinity) => {
    var i = 0;
    while (i < timeout) {
        var middle = getMidpoint(left, right);
        var comparison = comparatorToTarget(middle);
        if (comparison < 0) {
            right = middle;
        } else if (comparison === 0) {
            return middle;
        } else if (comparison > 0) {
            left = middle;
        }
        i++;
    }
    return null;
};