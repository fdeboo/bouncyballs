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
      x: Math.floor(Math.random() * 40 - 20),
      y: Math.floor(Math.random() * 40 - 20),
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
   * Calculate the acceleration rate since last frame
   * Calculate the current velocity based on its rate of acceleration m/psecond
   * Calculate the new position from the veloctity and time passed
   * Rebound the direction if the ball reaches the canvas boundaries
   * Credit: (https://burakkanber.com/blog/modeling-physics-javascript-gravity-and-drag/)
   */
  _applyPhysics() {
    const acclX =
      (drag * this.radius ** 2 * this.velocity.x * Math.abs(this.velocity.x)) /
      this.mass;
    const acclY =
      (gr +
        drag * this.radius ** 2 * this.velocity.y * Math.abs(this.velocity.y)) /
      this.mass;

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
const eventHandler = (ev) => {
  const { x, y } = ev;
  const ball = new Ball(x, y);
  ball._draw();
  ballsArr.push(ball);
};

canvas.addEventListener("touchstart", (ev) => {
  ev.preventDefault();
  const [clientX, clientY] = ev.touches[0];
  console.log(clientX, clientY);
  console.log(ev);
  const ball = new Ball(clientX, clientY);
  ball._draw();
  ballsArr.push(ball);
});
canvas.addEventListener("click", (ev) => eventHandler(ev));

//////////////////// IGNORE THE BELOW

// const Cd = 0.47; // Coefficient of Drag
// const rho = 1.22; // Density of environment (air) (kg/m^3)]

// Apply physics F = -0.5 * C *A *rho * v^2
// const A = (Math.PI * this.radius ** 2) / 1000; // frontal Projection
// let Fx = -0.5 * Cd * A * rho * this.velocity.x ** 2;
// let Fy = -0.5 * Cd * A * rho * this.velocity.y ** 2;
// Fx = isNaN(Fx) ? 0 : Fx;
// Fy = isNaN(Fy) ? 0 : Fy;
// const acclX = Fx / this.mass;
// const acclY = gr + Fy / this.mass;
//
// const forces = -0.0003 * Math.PI * this.radius ** 2;
