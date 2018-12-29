var R = require('ramda');
var edgesMap = require('../graphs/edges-map');
var bfs = require('../pathfinding/bfs');

var connectedComponents = (nodes, hasEdge) => {
    var edges = edgesMap(nodes, hasEdge);
    var unvisited = new Set(nodes);

    var components = [];
    while(unvisited.size > 0) {
        var node = unvisited.values().next().value;
        var component = [];
        bfs(node, x => { component.push(node); unvisited.delete(x); return false; }, x => edges.get(x));
        components.push(component);
    }

    return components;
};

module.exports = connectedComponents;