window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( /* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();


var forest = {
    X: 700,
    Y: 700,
    propTree: 0.01,
    propTree2: 0.01,
    propBurn: 0.001, //Burn chance
    t: [],
    c: ['#000000', '#25f68b', '#f17400']
};

for (var i = 0; i < forest.Y; i++) {
    forest.t[i] = [];
    for (var j = 0; j < forest.Y; j++) {
        forest.t[i][j] = Math.random() < forest.propTree ? 1 : 0;
    }
}


function afterStep(forest) {
    var scale = 1;
    var canvas = document.getElementById('game');
    var c = canvas.getContext('2d');
    for (i = 0; i < forest.X; i++) {
        for (j = 0; j < forest.Y; j++) {
            c.fillStyle = forest.c[forest.t[i][j]];
            c.fillRect(scale * j, scale * i, scale * j + 9, scale * i + 9);
        }
    }
}

function step(forest) {
    var temp = [];
    for (i = 0; i < forest.Y; i++) {
        temp[i] = forest.t[i].slice(0);
    }

    for (i = 0; i < forest.Y; i++) {
        for (j = 0; j < forest.Y; j++) {
            if (temp[i][j] === 0) {
                forest.t[i][j] = Math.random() < forest.propTree2 ? 1 : 0;
            } else if (temp[i][j] === 1) {
                if (((i > 0) && (2 == temp[i - 1][j])) ||
                    ((i < forest.Y - 1) && (2 == temp[i + 1][j])) ||
                    ((j > 0) && (2 == temp[i][j - 1])) ||
                    ((j < forest.X - 1) && (2 == temp[i][j + 1]))) {
                    forest.t[i][j] = 2;
                } else {
                    forest.t[i][j] = Math.random() < forest.propBurn ? 2 : 1; //generate random number and compare against burn chance
                }
            } else if (temp[i][j] === 2) {
                //Create empty cell if burnt
                forest.t[i][j] = 0;
            }
        }
    }

}

function start() {
    (function gameLoop() {
        this.step(forest);
        this.afterStep(forest);
        requestAnimFrame(gameLoop, this.ctx);
    })();
}

start();