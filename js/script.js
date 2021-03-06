const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const frameRate = 1 / 40; // seconds
const loopInterval = frameRate * 1000; // milliseconds
const ballsArr = [];
let [width, height] = [window.innerWidth, window.innerHeight];
const gr = 9.81; // Gravity
const drag = -0.0009;

/**
 * Redraws the canvas with the calculated position of every ball in the balls array (if any)
 *
 * Clear the canvas
 * Check for existing balls (return if none)
 * Loop existing ball objects in array
 * Calculate the new position of each ball and draw it on the canvas
 */
const frameLoop = () => {
  ctx.clearRect(0, 0, width, height);
  ctx.save();

  if (ballsArr.length === 0) return;
  ballsArr.forEach((ball) => {
    ball._applyPhysics();
    ball._draw();
  });
};
const loop = setInterval(frameLoop, loopInterval);

canvas.setAttribute("width", width);
canvas.setAttribute("height", height);

class Ball {
  constructor(x, y) {
    this.position = { x: x, y: y };
    this.velocity = {
      x: Math.floor(Math.random() * 10 - 10),
      y: Math.floor(Math.random() * 10 - 10),
    };
    this.mass = 0.4;
    this.radius = 8;
    this.bounce = -0.7; // must be negative
  }

  /**
   * draws a circle to the canvas
   */
  _draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }

  /**
   * Calculates the position of the ball based on its speed in x and y directions
   *
   * Assumes 1px = 1cm
   * Calculate the acceleration with affect of drag for X and Y
   * Calculate the current velocity based on its rate of acceleration m/psecond
   * Calculate the new position from the veloctity and time passed
   * Rebound the ball if it reaches the canvas boundaries
   * Credit: (https://burakkanber.com/blog/modeling-physics-javascript-gravity-and-drag/)
   */
  _applyPhysics() {
    const acclX = drag * this.velocity.x ** 2;
    const acclY = gr + drag * this.velocity.y ** 2;
    this.velocity.x += acclX * frameRate;
    this.velocity.y += acclY * frameRate;

    this.position.x += this.velocity.x * frameRate * 100;
    this.position.y += this.velocity.y * frameRate * 100;

    // Handle if ball encounters y-axis boundary
    if (
      this.position.y > height - this.radius ||
      this.position.y < this.radius
    ) {
      this.velocity.y *= this.bounce; // returns negative value
      this.position.y =
        this.position.y < this.radius ? this.radius : height - this.radius;
    }

    // Handle if ball encounters x-axis boundary
    if (
      this.position.x > width - this.radius ||
      this.position.x < this.radius
    ) {
      this.velocity.x *= this.bounce;
      this.position.x =
        this.position.x < this.radius ? this.radius : width - this.radius;
    }
  }
}

/**
 * Whenever the browser window is resized, resets the values of width
 * and height variables and updates the size of the canvas
 */
window.addEventListener("resize", (e) => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
});

/**
 * Creates a new ball object using the coords of the click/touch screen event.
 * Extracts the X and Y location from the event object
 * Draws the new ball to the canvas and then adds it to array of ball objects
 */
const createBall = (x, y) => {
  const ball = new Ball(x, y);
  ball._draw();
  ballsArr.push(ball);
};

canvas.addEventListener("touchstart", (ev) => {
  ev.preventDefault();
  const clientX = ev.touches[0].clientX;
  const clientY = ev.touches[0].clientY;
  createBall(clientX, clientY);
});
canvas.addEventListener("click", (ev) => {
  const { clientX, clientY } = ev;
  createBall(clientX, clientY);
});
