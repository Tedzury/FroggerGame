
const tileWidth = 100;
const tileHeight = 83;
const numberOfRows = 6;
const numberOfColumns = 5;
const fieldWidth = numberOfColumns * tileWidth;
const fieldHeight = numberOfRows * tileHeight;
const fieldGap = 100;

const firstEnemyRow = Math.round(tileHeight * 0.66);
const secondEnemyRow = Math.round(tileHeight + tileHeight * 0.66);
const thirdEnemyRow = Math.round(tileHeight * 2 + tileHeight * 0.66);

const playerStartingPositionX = tileWidth * 2; 
const playerStartingPositionY = fieldHeight - fieldGap;


const Entity = function () {
  this.width = 80;
  this.height = 70;
}

const Player = function (xAxisPosition, yAxisPosition, width, height) {
  Entity.call(this, width, height)
  this.xAxisPosition = xAxisPosition;
  this.yAxisPosition = yAxisPosition;
  this.moveXAxis = tileWidth;
  this.moveYAxis = tileHeight;
  this.sprite = "images/char-boy.png";
  this.score = 0;
  this.scoreMax = 0;
};

Player.prototype.update = function () {
  if (player.yAxisPosition < 0) {
    player.respawn();
    player.win();
  }
};

Player.prototype.win = function () {
  scoreTitle.textContent = `Current score is: ${(this.score += 1)}`;

  if (this.score > this.scoreMax) {
    this.scoreMax = this.score;
    maxScoreTitle.textContent = `Your max score is: ${this.scoreMax}`;
  }
};

Player.prototype.render = function () {
  ctx.drawImage(
    Resources.get(this.sprite),
    this.xAxisPosition,
    this.yAxisPosition
  );
};

Player.prototype.respawn = function () {
  this.xAxisPosition = playerStartingPositionX;
  this.yAxisPosition = playerStartingPositionY;
};

Player.prototype.handleInput = function (key) {
  switch (key) {
    case "up":
      this.yAxisPosition -= this.moveYAxis;
      break;
    case "down":
      this.yAxisPosition += this.moveYAxis;
      if (this.yAxisPosition >= (fieldHeight - fieldGap)) {
        this.yAxisPosition = fieldHeight - fieldGap;
      }
      break;
    case "left":
      this.xAxisPosition -= this.moveXAxis;
      if (this.xAxisPosition < 0) {
        this.xAxisPosition = 0;
      }
      break;
    case "right":
      this.xAxisPosition += this.moveXAxis;
      if (this.xAxisPosition >= fieldWidth) {
        this.xAxisPosition = fieldWidth - fieldGap;
      }
      break;
  }
};

const player = new Player(playerStartingPositionX, playerStartingPositionY);

const Enemy = function (yAxisPosition, moveSpeed, width, height, player) {
  Entity.call(this, width, height)
  this.xAxisPosition = -this.width;
  this.yAxisPosition = yAxisPosition;
  this.moveSpeed = moveSpeed;
  this.sprite = "images/enemy-bug.png";
  this.player = player;
};

Enemy.prototype.update = function (dt) {
  this.xAxisPosition += this.moveSpeed * dt;

  if (this.xAxisPosition >= ctx.canvas.width) {
    this.xAxisPosition = -this.width;
  }

  this.checkCollision();
};

Enemy.prototype.render = function () {
  ctx.drawImage(
    Resources.get(this.sprite),
    this.xAxisPosition,
    this.yAxisPosition
  );
};

Enemy.prototype.checkCollision = function () {

  if (
    player.xAxisPosition < this.xAxisPosition + this.width &&
    player.width + player.xAxisPosition > this.xAxisPosition &&
    player.yAxisPosition < this.yAxisPosition + this.height &&
    player.yAxisPosition + player.height > this.yAxisPosition
  ) {
    
    player.respawn();
    player.score = 0;
    scoreTitle.textContent = `Current score is: ${player.score}`;
  }
};

const enemyStats = [
  {
    yAxisPosition: firstEnemyRow,
    moveSpeed: 180,
  },
  {
    yAxisPosition: secondEnemyRow,
    moveSpeed: 150,
  },
  {
    yAxisPosition: thirdEnemyRow,
    moveSpeed: 120,
  },
];


const allEnemies = enemyStats.map(
  ({ yAxisPosition, moveSpeed }) =>
    new Enemy(yAxisPosition, moveSpeed)
);

document.addEventListener("keyup", function (e) {
  var allowedKeys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
  };

  player.handleInput(allowedKeys[e.keyCode]);
});

const scoreWrapper = document.createElement("div");
scoreWrapper.classList.add("score__wrapper");
const scoreTitle = document.createElement("span");
const maxScoreTitle = document.createElement("span");
maxScoreTitle.textContent = `Your max score is: ${player.scoreMax}`;
scoreTitle.textContent = `Current score is: ${player.score}`;

scoreWrapper.append(scoreTitle);
scoreWrapper.append(maxScoreTitle);
document.body.append(scoreWrapper);
