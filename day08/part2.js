var R = require('ramda');
var Stack = require('mnemonist/stack');

class Node {
    constructor() {
        this.children = [];
        this.metadata = [];
    }
};

var parseInput = R.pipe(R.trim, R.split(' '), R.map(parseInt));

var licenseTree = (values) => {
    var node = new Node();

    var childCount = values.pop();
    var metaCount = values.pop();
    for(var i = 0; i < childCount; i++) {
        node.children.push(licenseTree(values));
    }
    for(var j = 0; j < metaCount; j++) {
        node.metadata.push(values.pop());
    }

    return node;
};

var sumMetadata = node => {
    if (!node) return 0;
    if (node.children.length === 0) {
        return R.sum(node.metadata);
    } else {
        return R.pipe(R.map(x => sumMetadata(node.children[x - 1])), R.sum)(node.metadata);
    }
};

var solution = R.pipe(parseInput, R.reverse, Stack.from, licenseTree, sumMetadata);

module.exports = solution;