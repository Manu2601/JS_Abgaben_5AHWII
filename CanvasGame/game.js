let imageMonkey = new Image();
imageMonkey.src = "face-monkey.png";
let imageDevil = new Image();
imageDevil.src = "face-devilish.png";
let imageCool = new Image();
imageCool.src = "face-cool.png";
let bonusstein = null;
let enimies = [];
let score = 0;
let timer = 0;

let game = {
    canvas: document.getElementById("field"),
    start () {
        timer = 0;
        score = 0;
        enimies = [];
        console.log(this.canvas);
        this.context = this.canvas.getContext("2d");
        this.clear();
        this.interval = setInterval(redraw, 20);
        this.intervalNewEnemy = setInterval(newEnemy, 600);
        this.intervalBonus = setInterval(newBonus, 4000);
        this.intervalScore = setInterval(increaseScore, 1000);
        this.player = new sprite(30, 30, "red", 10, 120);
        this.enemies = [];
        this.keyCode = -1; //when there is no key pressed

                window.addEventListener('keydown', (e) => {
            this.keyCode = e.keyCode;
        });

        window.addEventListener('keyup', (e) => {
            this.keyPressed = -1;
        });
    },
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function start() {
    console.log("Game started");
    game.start();
}

function sprite(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.color = color;
    ctx = game.context;

    this.redraw = function() {
        ctx = game.context;
        if (this.color === "red") {
            ctx.drawImage(imageMonkey, this.x, this.y, this.width, this.height);
        } else if (this.color === "blue") {
            let collision = checkCollision();
            if (collision) {
                alert("Game Over");
                clearInterval(game.interval);
                clearInterval(game.intervalNewEnemy);
                clearInterval(game.intervalBonus);
                clearInterval(game.intervalScore); 
            }
            ctx.drawImage(imageDevil, this.x, this.y, this.width, this.height);
        } else if (this.color === "cool") {
            ctx.drawImage(imageCool, this.x, this.y, this.width, this.height);
        }
    };
}

function redraw() {
    game.clear();

    // Bewegung des Spielers
    switch (game.keyCode) {
        case 37: //left
            game.player.x -= 3;
            break;
        case 38: //up
            game.player.y -= 3;
            break;
        case 39: //right
            game.player.x += 3;
            break;
        case 40: //down
            game.player.y += 3;
            break;
    }
    if (game.player.x < 0) {
        game.player.x = 0;
    } else if (game.player.x + game.player.width > game.canvas.width) {
        game.player.x = game.canvas.width - game.player.width;
    }
    
    if (game.player.y < 0) {
        game.player.y = 0;
    } else if (game.player.y + game.player.height > game.canvas.height) {
        game.player.y = game.canvas.height - game.player.height;
    }
    
    game.player.redraw();

    game.enemies.forEach((e) => {
        let yDelta = Math.floor(Math.random() * 11) - 5;
        e.x -= 1;
        e.y += yDelta;
        e.redraw();
    });

    if (bonusstein) {
        bonusstein.redraw();
    }

    if (bonusstein && checkBonus()) {
        score += 15; 
        bonusstein = null;
        console.log("Bonus eingesammelt! Score:", score);
    }

    showTimerScore();
}

function newEnemy() {
    let y = Math.floor(Math.random() * 1024);
    let e = new sprite(30, 30, "blue", 1000, y);
    game.enemies.push(e);
    enimies.push({ x: e.x, y: e.y });
   }

function newBonus() {
    if (!bonusstein) {
        let x = Math.floor(Math.random() * (game.canvas.width - 30)); // zufällige Position
        let y = Math.floor(Math.random() * (game.canvas.height - 30));
        bonusstein = new sprite(30, 30, "cool", x, y);
    }
}

function increaseScore() {
    score += 1;
    timer += 1;
}

function checkCollision() {
    let player = { x: game.player.x, y: game.player.y, width: game.player.width, height: game.player.height };
    let collision = false;
    game.enemies.forEach((e) => {
        let enemy = { x: e.x, y: e.y, width: e.width, height: e.height };
        if (player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
            collision = true;
        }
    });
    return collision;
}

function checkBonus() {
    let player = { x: game.player.x, y: game.player.y, width: game.player.width, height: game.player.height };
    let bonus = { x: bonusstein.x, y: bonusstein.y, width: bonusstein.width, height: bonusstein.height };
    if (player.x < bonus.x + bonus.width &&
        player.x + player.width > bonus.x &&
        player.y < bonus.y + bonus.height &&
        player.y + player.height > bonus.y) {
        return true;
    }
    return false;
}

function showTimerScore() {
    ctx = game.context;
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 20, 20);
    ctx.fillText("Time: " + timer.toFixed(1) + "s", 20, 40);
}
