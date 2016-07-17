/*-------------------
    Enemy Class
-------------------*/

var Enemy = function(x, y) {
    this.X_MAX = 700;
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speedMin = 200;
    this.speedMax = 300;
    this.generateSpeed();
};

// Generate a random speed for each enemy
Enemy.prototype.generateSpeed = function() {
    this.speed = Math.floor(Math.random() * this.speedMax) + this.speedMin;
};

// Update the enemy's position
Enemy.prototype.update = function(dt) { // dt - a time delta between ticks
    this.x += (this.speed * dt);
    if (this.x > this.X_MAX) {
        this.reset();
    }
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Reset enemy position after an enemy has gone beyond the screen
Enemy.prototype.reset = function() {
    this.x = -150;
};


/*-------------------
    Player Class
-------------------*/

var Player = function() {
    this.X_MIN = -2;
    this.X_MAX = 702;
    this.Y_MIN = -20;
    this.Y_MAX = 540;
    this.sprite = 'images/arnold.png';
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
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

// Reset player position (on game over or after getting to tha' choppa!)
Player.prototype.reset =  function() {
    this.x = 200;
    this.y = 540;
};

// Check if there's a collision
Player.prototype.checkCollisions = function() {
    // Arnold got to the choppa! (Win)
    if (this.y <= 50 && this.x <= 350 && this.x >= 250) {
        var c = confirm("You got to the choppa, Arnold! Now why not speed things up?");
        if (c == true) {
            allEnemies.forEach(function(enemy) {
                enemy.speedMax += 200;
                enemy.speedMin += 200;
                enemy.generateSpeed();
            });
            this.reset();
        }
        else {
            this.reset();
        }
    }
    // Arnold got in the water, but not inside the choppa! (Game Over)
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
    Choppa Class
-------------------*/

var Choppa = function() {
    this.sprite = 'images/choppa.png';
    this.x = 310;
    this.y = 60;
}

// Draw the choppa on the screen
Choppa.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Instantiate objects
var allEnemies = [ 
    new Enemy(-2, 60),
    new Enemy(-2, 140),
    new Enemy(-2, 220),
    new Enemy(-2, 300),
    new Enemy(-2, 380)
];
var player = new Player();
var choppa = new Choppa();





