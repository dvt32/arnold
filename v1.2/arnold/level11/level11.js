/*-------------------
 Switch to Next Level
-------------------*/

startNextLevel = function() {
    location.href = "../end.html";
};


/*-------------------
    Dark Wizardry
-------------------*/

document.body.style.backgroundColor = "#3e4756";

/*-------------------
    Level Engine
-------------------*/

var Engine = (function(global) {
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 909;
    canvas.height = 923;
    doc.body.appendChild(canvas);

    function main() {
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;
        update(dt);
        render();
        lastTime = now;
        win.requestAnimationFrame(main);
    }

    function init() {
        lastTime = Date.now();
        main();
    }

    function update(dt) {
        updateEntities(dt);
    }

    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    function render() {
        var rowImages = [
                '../images/water-block.png',   // Top row is water
                '../images/stone-block.png',   // Row 1 of 7 of stone
                '../images/stone-block.png',   // Row 2 of 7 of stone
                '../images/stone-block.png',   // Row 3 of 7 of stone
                '../images/stone-block.png',   // Row 4 of 7 of stone
                '../images/stone-block.png',   // Row 5 of 7 of stone
                '../images/stone-block.png',   // Row 6 of 7 of stone
                '../images/stone-block.png',   // Row 7 of 7 of stone
                '../images/grass-block.png',   // Row 1 of 2 of grass
                '../images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 10,
            numCols = 9,
            row, col;
            
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    function renderEntities() {
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        player.render();
        vader.render();
    }

    Resources.load([
        '../images/stone-block.png',
        '../images/water-block.png',
        '../images/grass-block.png',
        '../images/luke.png',
        '../images/stormtrooper.png',
        '../images/vader.png'
    ]);
    Resources.onReady(init);

    global.ctx = ctx;
})(this);


/*-------------------
    Enemy Class
-------------------*/

Enemy = function(x, y, side) {
    this.side = side;
    this.X_MAX = (this.side === 'flipped') ? -350 : 900;
    this.Y_MAX = 770;
    this.sprite = '../images/stormtrooper.png';
    this.x = x;
    this.y = y;
    this.speedMin = 350;
    this.speedMax = 450;
    this.generateSpeed();
};

// Generate a random speed for each enemy
Enemy.prototype.generateSpeed = function() {
    this.speed = Math.floor(Math.random() * this.speedMax) + this.speedMin;
};

// Update the enemy's position
Enemy.prototype.update = function(dt) { // dt - a time delta between ticks
    if (this.side === 'flipped') {
        this.x -= (this.speed * dt);
        if (this.x < this.X_MAX) {
            this.reset();
        }  
    }
    else if (this.side === 'vertical') {
        this.y += (this.speed * dt);
        if (this.y > this.Y_MAX) {
            this.reset();
        }  
    }
    else {
        this.x += (this.speed * dt);
        if (this.x > this.X_MAX) {
            this.reset();
        } 
    }
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Reset enemy position after an enemy has gone beyond the screen
Enemy.prototype.reset = function() {
    if (this.side === 'flipped') {
        this.x = 900;
    }
    else if (this.side === 'vertical') {
        this.y = -20;
    }
    else {
        this.x = -350;
    }
};


/*-------------------
    Player Class
-------------------*/

var Player = function() {
    this.X_MIN = -2;
    this.X_MAX = 904;
    this.Y_MIN = -20;
    this.Y_MAX = 700;
    this.sprite = '../images/luke.png';
    this.reset();
};

// Update the player's position
Player.prototype.update = function(dt) { 
    this.checkCollisions();
}

// Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Handle input by user
Player.prototype.handleInput = function(keyPressed) {
    switch (keyPressed) {
        case 'left':
            this.x -= (this.x - 101 < this.X_MIN) ? 0 : 101;
            break;
        case 'right':
            this.x += (this.x + 101 > this.X_MAX) ? 0 : 101;
            break;
        case 'up':
            this.y -= (this.y - 80 < this.Y_MIN) ? 0 : 80;
            break;
        case 'down':
            this.y += (this.y + 80 > this.Y_MAX) ? 0 : 80;
            break;
    }
};
var eventListenerFunction = function(e) {
    allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
}
document.addEventListener('keyup', eventListenerFunction);

// Reset player position (on game over or after getting to tha' Vader!)
Player.prototype.reset =  function() {
    this.x = 402;
    this.y = 700;
};

// Check if there's a collision
Player.prototype.checkCollisions = function() {
    // Arnold got to the Vader! (Win)
    if (this.y <= 50 && this.x <= 450 && this.x >= 350) {
        this.reset();
        startNextLevel();
    }
    // Arnold got in the water, but not inside the Vader! (Game Over)
    else if (this.y <= 50) {
        this.reset();
    }
    // Arnold hit an enemy! (Game Over)
    var player = this;
    allEnemies.forEach(function(enemy) {
        if (enemy.y === player.y) {
            if (enemy.x >= player.x - 30 && enemy.x <= player.x + 30) {
                player.reset();
            }
        }
    });
};


/*-------------------
    Vader Class
-------------------*/

var Vader = function() {
    this.sprite = '../images/vader.png';
    this.x = 415;
    this.y = 60;
}

// Draw the Vader on the screen
Vader.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


/*-------------------
 Instantiate Objects
-------------------*/

var allEnemies = [ 
    new Enemy(-2, 60, 'flipped'),
    new Enemy(-2, 140, 'normal'),
    new Enemy(-2, 220, 'flipped'),
    new Enemy(-2, 300, 'normal'),
    new Enemy(-2, 380, 'flipped'),
    new Enemy(-2, 460, 'normal'),
    new Enemy(-2, 540, 'flipped'),
    new Enemy(0, -20, 'vertical'),
    new Enemy(101, -20, 'vertical'),
    new Enemy(202, -20, 'vertical'),
    new Enemy(303, -20, 'vertical'),
    new Enemy(505, -20, 'vertical'),
    new Enemy(606, -20, 'vertical'),
    new Enemy(707, -20, 'vertical'),
    new Enemy(808, -20, 'vertical'),
];
var player = new Player();
var vader = new Vader();