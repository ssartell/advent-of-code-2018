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
    return R.sum(node.metadata) + R.pipe(R.map(sumMetadata), R.sum)(node.children)
}


var solution = R.pipe(parseInput, R.reverse, Stack.from, licenseTree, sumMetadata);

module.exports = solution;