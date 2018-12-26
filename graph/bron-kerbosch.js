var helpers = require('mnemonist/set');

var bronKerbosch = (n, R, P, X) => {
    if (P.size === 0 && X.size === 0) {
        return R;
    }
    var maxClique = new Set();
    var u = helpers.union(P, X).values().next().value;
    for(var p of helpers.difference(P, n.get(u))) {
        var setOfp = new Set([p]);
        var clique = bronKerbosch(n, helpers.union(R, setOfp), helpers.intersection(P, n.get(p)), helpers.intersection(X, n.get(p)));
        if (clique.size > maxClique.size) {
            maxClique = clique;
        }
        helpers.subtract(P, setOfp);
        X = helpers.union(X, setOfp);
    }

    return maxClique;
};

module.exports = (mapOfNeighboringSets, fullSet) => bronKerbosch(mapOfNeighboringSets, new Set(), fullSet, new Set());