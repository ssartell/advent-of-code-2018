module.exports = (low, high, comparatorToTarget, timeout = Infinity) => {
    var i = 0;
    while (i !== timeout) {
        var middle = Math.floor((low - high) / 2);
        var comparison = comparatorToTarget(middle);
        if (comparison < 0) {
            low = middle + 1;
        } else if (comparison > 0) {
            high = middle - 1;
        } else if (low !== middle) {
            high = middle;
        } else {
            return middle;
        }
        i++;
    }
    return null;
};