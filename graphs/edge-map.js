var addConnection = (connections, a, b) => {
    var set = connections.get(a);
    if (!set) {
        set = new Set();
        connections.set(a, set);
    }
    set.add(b);
};

var getIntersections = (nodes, areConnected) => {
    var connections = new Map();
    for(var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        connections.set(a, new Set());
        for(var j = i + 1; j < nodes.length; j++) {
            var b = nodes[j];
            if (areConnected(a, b)) {
                addConnection(connections, a, b);
                addConnection(connections, b, a);
            }
        }
    }
    return connections;
};

module.exports = getIntersections;