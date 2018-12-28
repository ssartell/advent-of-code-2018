var graphEdgesMap = (nodes, hasEdge) => {
    var edges = new Map();
    for(var node of nodes) {
        edges.set(node, new Set());
    }

    for(var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        for(var j = i + 1; j < nodes.length; j++) {
            var b = nodes[j];
            if (hasEdge(a, b)) {
                edges.get(a).add(b);
                edges.get(b).add(a);
            }
        }
    }

    return edges;
};

module.exports = graphEdgesMap;