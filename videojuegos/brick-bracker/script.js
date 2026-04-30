import Rect from "./libs/Rect.js";
import Vector from "./libs/Vector.js";
import GameObject from "./libs/GameObject.js";
import { boxOverlap } from "./libs/game_functions.js";
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
const ballInitialVelocity = 1;
const MAX_HEIGHT = 300;
const COLORS = ["#e63946", "#f1faee", "#a8dadc", "#457b9d", "#1d3557"];
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
    this.setAnimation("idle");
    let angle = (Math.random() * Math.PI * 3) / 4 - Math.PI / 4;
    this.velocity = new Vector(Math.cos(angle), Math.sin(angle) * -1);
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
class Game {
  constructor() {
    this.padle = new Paddle();
    this.paused = false;
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
    this.topWall = new Wall(
      new Vector(canvaWidth - 1, canvasHeight / 2),
      10,
      canvasHeight,
    );
    this.topWall = new Wall(new Vector(canvaWidth / 2, 0), canvaWidth, 20);
    this.ball = new Ball(canvaWidth / 2, canvasHeight - 145, 30, 30);
    this.reset();
    this.actors = [];
    this.actors.push(this.padle, this.ball);
    this.setBricks();
  }
  setBricks() {
    this.bricks = [];
    this.bricksConut = 0;
    let yStart = 50;
    COLORS.forEach((color) => {
      for (let i = 50; i < canvaWidth - 50; i = i + 70) {
        this.bricks.push(new Brick({ x: i, y: yStart }, color));
        this.bricksConut++;
      }
      yStart += 40;
    });
  }
  reset() {
    window.addEventListener(
      "keydown",
      (event) => {
        this.ball.ballSpeed = ballInitialVelocity;
        this.ball.serve();
        this.padle.position = new Vector(canvaWidth / 2, canvasHeight - 120);
        this.ball.setAnimation("idle");
        this.paused = false;
        this.setBricks();
      },
      { once: true },
    );
  }
  pause() {
    this.paused = true;
    this.ball.velocity = new Vector(0, 0);
    this.padle.velocity = new Vector(0, 0);
    this.delKey("left", this.padle);
    this.delKey("right", this.padle);
    this.reset();
  }
  draw(deltaTime) {
    this.actors.forEach((actor) => actor.draw(deltaTime));
    this.bricks.forEach((brick) => brick.draw(deltaTime));
  }
  end() {
    this.ball.setAnimation("winner");
    this.pause();
  }
  update() {
    if (this.bricksConut === 0) this.end();
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
    if (this.bricksConut !== this.bricks.length) {
      const soundEffect = new Audio();
      soundEffect.src = "./soundEffect.mp3";
      soundEffect.addEventListener("loadedmetadata", () => soundEffect.play());
    }
    this.bricksConut = this.bricks.length;
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
      if (this.paused) return;
      // Detect the predefined keys for movement and store the direction
      if (event.key in keyDirections) {
        this.addKey(keyDirections[event.key], this.padle);
      }
    });

    window.addEventListener("keyup", (event) => {
      if (this.paused) return;
      // Detect the predefined keys for movement and remove the direction
      if (event.key in keyDirections) {
        this.delKey(keyDirections[event.key], this.padle);
      }
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
