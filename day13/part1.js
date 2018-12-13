var R = require('ramda');

var parseInput = R.pipe(R.split('\n'), R.map(R.split('')));

var getCarts = tracks => {
    var carts = [];
    for(var y = 0; y < tracks.length; y++) {
        for(var x = 0; x < tracks.length; x++) {
            var track = tracks[y][x];
            if (track === '^') {
                carts.push({x, y, dx: 0, dy: -1, i: 0});
                tracks[y][x] = '|';
            } else if (track === 'v') {
                carts.push({x, y, dx: 0, dy: 1, i: 0});
                tracks[y][x] = '|';
            } else if (track === '<') {
                carts.push({x, y, dx: -1, dy: 0, i: 0});
                tracks[y][x] = '-';
            } else if (track === '>') {
                carts.push({x, y, dx: 1, dy: 0, i: 0});
                tracks[y][x] = '-';
            }
        }
    }

    return carts;
};

var updateCart = (tracks, cart) => {
    cart.x += cart.dx;
    cart.y += cart.dy;
    var track = tracks[cart.y][cart.x];
    var dx = cart.dx;
    var dy = cart.dy;

    if (track === '+') {
        if (cart.i === 0) {
            cart.dx = dy;
            cart.dy = -dx;
        } else if (cart.i === 2) {
            cart.dx = -dy;
            cart.dy = dx;
        }
        cart.i = (cart.i + 1) % 3;
    } else if (track === '\\') {
        cart.dx = dy;
        cart.dy = dx;
    } else if (track === '/') {
        cart.dx = -dy;
        cart.dy = -dx;
    }
}

var inOrder = R.sort(R.comparator((a, b) => a.y < b.y || (a.y === b.y && a.x < b.x)));

var checkCollisions = carts => {
    for(var i = 0; i < carts.length - 1; i++) {
        var cartA = carts[i];
        for(var j = i + 1; j < carts.length; j++) {
            var cartB = carts[j];
            if (cartA.x === cartB.x && cartA.y === cartB.y) {
                return `${cartA.x},${cartA.y}`;
            }
        }
    }

    return null;
}

var solve = tracks => {
    var carts = getCarts(tracks);
    while(true) {
        for(var cart of inOrder(carts)) {
            updateCart(tracks, cart);
            var collisionResult = checkCollisions(carts);
            if (collisionResult) {
                return collisionResult;
            }
        }
    }
}

var solution = R.pipe(parseInput, solve);

module.exports = solution;