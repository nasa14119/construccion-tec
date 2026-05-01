import Rect from "./libs/Rect.js";
import Vector from "./libs/Vector.js";
import GameObject from "./libs/GameObject.js";
import TextLabel from "./libs/TextLabel.js";
import { boxOverlap, playSoundEffect } from "./libs/game_functions.js";
/** @type {HTMLCanvasElement} */
const canva = document.querySelector("#canva");
const canvaWidth = canva.width;
const canvasHeight = canva.height;
const ctx = canva.getContext("2d");

const spriteWidth = 512;
const frameWidth = spriteWidth / 16;
const frameHeight = 170 / 5;

const maxcol = 21;
const spritePath = "./MarioSprite.png";
const spritePathInverted = "./MarioSpriteInverted.png";
const paddleSpeed = 5;
const ballInitialVelocity = 3;
const MAX_HEIGHT = 300;
const COLORS = ["#e63946", "#f1faee", "#a8dadc", "#457b9d", "#1d3557"];
const maxLevel = 3;
const keyDirections = {
  a: "left",
  d: "right",
  ArrowLeft: "left",
  ArrowRight: "right",
};
class Brick extends GameObject {
  constructor({ x, y }, color) {
    super(new Vector(x, y), 50, 20, color);
  }
  draw() {
    super.draw(ctx);
  }
}
class Ball extends GameObject {
  _position = {};
  constructor(x, y, width, height) {
    super(new Vector(x, y), width, height, "transparent");
    this.velocity = new Vector(0, 0);
    this.ballSpeed = 0;
    this._position = new Vector(x, y);
    ((this.width = width - 1), (this.height = height));
    this.setSprite(spritePath, new Rect(0, 0, this.width, this.height));
    this.setAnimation("idle");
  }
  setAnimation(pos) {
    let item;
    if (typeof pos == "string") {
      item = { idle: [3, 0], lose: [14, 3], winner: [6, 2] }[pos];
      this.setSprite(
        spritePath,
        new Rect(
          item[0] * frameWidth,
          item[1] * frameHeight,
          this.width,
          this.height,
        ),
      );
      return;
    }
    const [x, y] = pos;
    if (x == "right") {
      y === "down" && (item = [13, 2]);
      y === "up" && (item = [12, 0]);
      y === "break" && (item = [11, 0]);
      const spriteRect = new Rect(
        item[0] * frameWidth,
        item[1] * frameHeight,
        this.width,
        this.height,
      );
      this.setSprite(spritePath, spriteRect);
      return;
    }
    y === "down" && (item = [3, 2]);
    y === "up" && (item = [3, 0]);
    y === "break" && (item = [4, 0]);
    this.setSprite(
      spritePathInverted,
      new Rect(
        item[0] * frameWidth + 1,
        item[1] * frameHeight,
        this.width,
        this.height,
      ),
    );
  }
  draw() {
    super.draw(ctx);
  }
  serve() {
    this.ballSpeed = ballInitialVelocity;
    let min = (50 * Math.PI) / 180;
    let max = (140 * Math.PI) / 180;
    let angle = Math.random() * (max - min) + min;
    this.velocity = new Vector(Math.cos(angle), -Math.sin(angle));
    this._position = new Vector(0, 0);
    this.position = new Vector(canvaWidth / 2, canvasHeight - 145);
  }
  set position(vec) {
    const { x, y } = { ...this._position };
    const newDirection = [
      x < vec.x ? "right" : "left",
      y < vec.y ? "down" : vec.y > MAX_HEIGHT ? "up" : "break",
    ];
    if (
      !this.direction ||
      newDirection[0] !== this.direction[0] ||
      newDirection[1] !== this.direction[1]
    ) {
      this.direction = newDirection;
      this.setAnimation(this.direction);
    }
    this._position = vec;
  }
  get position() {
    return this._position;
  }
  increaseSpeed() {
    this.ballSpeed += 0.1;
  }
  update(deltaTime) {
    this.position = this.position.plus(this.velocity.times(this.ballSpeed));
    this.updateCollider();
  }
}
class Wall extends GameObject {
  constructor(position, width, height) {
    super(position, width, height, "#ffffff20");
    this.setCollider(width, height);
    this.updateCollider();
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.position.x - this.halfSize.x * this.scale,
      this.position.y - this.halfSize.y * this.scale,
      this.size.x * this.scale,
      this.size.y * this.scale,
    );
  }
}
class Paddle extends GameObject {
  constructor() {
    const width = 80;
    const height = 20;
    const position = new Vector(canvaWidth / 2, canvasHeight - 120);
    super(position, width, height, "black");
    this.velocity = new Vector(0, 0);
    this.motion = {
      left: {
        axis: "x",
        sign: -1,
      },
      right: {
        axis: "x",
        sign: +1,
      },
    };
    this.keys = [];
    this.setCollider(width, height);
    this.updateCollider();
  }
  draw() {
    super.draw(ctx);
  }
  update(deltaTime) {
    this.velocity.x = 0;
    this.velocity.y = 0;
    // Modify the velocity according to the directions pressed
    for (const direction of this.keys) {
      const axis = this.motion[direction].axis;
      const sign = this.motion[direction].sign;
      this.velocity[axis] = sign;
    }
    // Normalize the velocity to avoid greater speed on diagonals
    this.velocity = this.velocity.normalize().times(paddleSpeed);
    this.position = this.position.plus(this.velocity);

    this.clampWithinCanvas();

    this.updateCollider();
  }
  clampWithinCanvas() {
    // Top border
    if (this.position.x - this.halfSize.x < 0) {
      this.position.x = this.halfSize.x;
    }
    // Bottom border
    if (this.position.x + this.halfSize.x > canvaWidth) {
      this.position.x = canvaWidth - this.halfSize.x;
    }
  }
}
class Heart extends GameObject {
  constructor(x, y) {
    super(new Vector(x, y), 20, 20);
    this.position = new Vector(x, y);
    this.setSprite("./heart.png", new Rect(0, 0, 677, 677));
  }
  draw() {
    super.draw(ctx);
  }
}
class GameOverText extends TextLabel {
  constructor(text, padding = 0) {
    super(
      canvaWidth / 2 - 100,
      canvasHeight / 2 + padding,
      '40px "Pixelify Sans"',
      "#fff",
      text,
    );
  }
  draw() {
    super.draw(ctx);
  }
}
class BlackScreen extends GameObject {
  constructor() {
    super(
      new Vector(canvaWidth / 2, canvasHeight / 2),
      canvaWidth,
      canvasHeight,
      "#000",
    );
  }
  draw() {
    super.draw(ctx);
  }
}
class Game {
  constructor() {
    this.padle = new Paddle();
    this.paused = true;
    this.level = 1;
    this.isOver = false;
    this.isWin = false;
    this.resetLives();
    this.loseObjects = [
      new BlackScreen(),
      new GameOverText("GAME OVER"),
      new GameOverText("PRESS [r]", 50),
    ];
    this.winBall = new Ball(canvaWidth / 2 - 10, canvasHeight / 2, 30, 30);
    this.winBall.setAnimation("winner");
    this.winObjects = [
      new BlackScreen(),
      this.winBall,
      new GameOverText("YOU WIN!!", 50),
      new GameOverText("PRESS [r]", 100),
    ];
    this.downWall = new Wall(
      new Vector(canvaWidth / 2, canvasHeight - 80),
      canvaWidth,
      20,
    );
    this.rightWall = new Wall(
      new Vector(canvaWidth - 1, canvasHeight / 2),
      10,
      canvasHeight,
    );
    this.leftWall = new Wall(new Vector(2, canvasHeight / 2), 10, canvasHeight);
    this.topWall = new Wall(new Vector(canvaWidth / 2, 0), canvaWidth, 10);
    this.ball = new Ball(canvaWidth / 2, canvasHeight - 145, 30, 30);
    this.actors = [];
    this.actors.push(this.padle, this.ball);
    this.setBricks();
  }
  setBricks() {
    this.bricks = [];
    this.bricksCount = 0;
    let yStart = 50;
    COLORS.toSpliced(3, maxLevel - this.level).forEach((color) => {
      for (let i = 50; i < canvaWidth - 50; i = i + 70) {
        this.bricks.push(new Brick({ x: i, y: yStart }, color));
        this.bricksCount++;
      }
      yStart += 40;
    });
  }
  resetLives() {
    this.lives = [
      new Heart(canvaWidth - 10, canvasHeight - 20),
      new Heart(canvaWidth - 35, canvasHeight - 20),
      new Heart(canvaWidth - 60, canvasHeight - 20),
    ];
  }
  pause() {
    this.paused = true;
    this.ball.velocity = new Vector(0, 0);
    this.padle.velocity = new Vector(0, 0);
    this.ball.ballSpeed = 0;
    this.delKey("left", this.padle);
    this.delKey("right", this.padle);
  }
  draw(deltaTime) {
    if (this.isOver) {
      this.loseObjects.forEach((item) => item.draw(deltaTime));
      return;
    }
    if (this.isWin) {
      this.winObjects.forEach((item) => item.draw(deltaTime));
      return;
    }
    this.lives.forEach((heart) => heart.draw(deltaTime));
    this.actors.forEach((actor) => actor.draw(deltaTime));
    this.bricks.forEach((brick) => brick.draw(deltaTime));
  }
  end() {
    if (this.level > maxLevel) {
      this.isWin = true;
    }
    this.ball.setAnimation("winner");
    this.pause();
  }
  update() {
    if (this.bricksCount === 0) {
      this.end();
    }
    ctx.clearRect(0, 0, canvaWidth, canvasHeight);
    this.actors.forEach((actor) => actor.update(deltaTime));
    if (
      boxOverlap(this.ball, this.padle) ||
      boxOverlap(this.ball, this.topWall)
    ) {
      this.ball.velocity.y *= -1;
      this.ball.increaseSpeed();
    }
    if (
      boxOverlap(this.ball, this.leftWall) ||
      boxOverlap(this.ball, this.rightWall)
    ) {
      this.ball.increaseSpeed();
      this.ball.velocity.x *= -1;
    }
    if (boxOverlap(this.ball, this.downWall)) {
      if (!this.paused) {
        this.lives.pop();
        this.lives.length > 0 && playSoundEffect("./downEffect.mp3", true);
      }
      this.pause();
      this.ball.setAnimation("lose");
    }
    let filterval = null;
    this.bricks.forEach((brick, i) => {
      if (boxOverlap(this.ball, brick)) {
        this.ball.velocity.y *= -1;
        filterval = i;
      }
    });
    if (filterval !== null) this.bricks = this.bricks.toSpliced(filterval, 1);
    if (this.bricksCount !== this.bricks.length) {
      playSoundEffect("./soundEffect.mp3");
    }
    this.bricksCount = this.bricks.length;
    if (this.bricksCount === 0 && !this.paused) {
      this.level++;
      !this.paused &&
        this.level > maxLevel &&
        playSoundEffect("./winEffect.mp3", true);
      if (!this.paused && this.level < maxLevel) {
        playSoundEffect("./upEffect.mp3", true);
      }
      this.pause();
    }
    if (!this.isOver && this.lives.length === 0) {
      playSoundEffect("./loseEffect.mp3", true);
    }
    if (this.lives.length === 0) {
      this.isOver = true;
      this.pause();
    }
    this.draw();
  }
  // Add the key pressed to the 'keys' array of the object sent
  addKey(direction, object) {
    if (this.paused) return;
    if (!object.keys.includes(direction)) {
      object.keys.push(direction);
    }
  }

  // Remove the key pressed from the 'keys' array of the object sent
  delKey(direction, object) {
    if (object.keys.includes(direction)) {
      object.keys.splice(object.keys.indexOf(direction), 1);
    }
  }
  createEventListeners() {
    window.addEventListener("keydown", (event) => {
      if (this.paused || this.bricks.length <= 0) return;
      // Detect the predefined keys for movement and store the direction
      if (event.key in keyDirections) {
        this.addKey(keyDirections[event.key], this.padle);
      }
    });

    window.addEventListener("keyup", (event) => {
      if (this.paused || this.bricks.length <= 0) return;
      // Detect the predefined keys for movement and remove the direction
      if (event.key in keyDirections) {
        this.delKey(keyDirections[event.key], this.padle);
      }
    });
    window.addEventListener("keydown", (e) => {
      if (!this.isOver && !this.isWin) return;
      if (e.key === "r") {
        this.resetLives();
        this.level = 1;
        this.isOver = false;
        this.isWin = false;
      }
    });
    window.addEventListener("keyup", (event) => {
      if (!this.paused) return;
      this.setBricks();
      this.ball.setAnimation("idle");
      this.padle.position = new Vector(canvaWidth / 2, canvasHeight - 120);
      this.paused = false;
      this.ball.serve();
    });
  }
}
const game = new Game();
game.createEventListeners();
let deltaTime = 0;
const main = (time) => {
  deltaTime = time - deltaTime;
  game.update();
  window.requestAnimationFrame(main);
};
window.requestAnimationFrame(main);
