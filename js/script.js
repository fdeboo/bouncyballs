const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const frameRate = 1 / 40; // seconds
const loopInterval = frameRate * 1000; // Convert to milliseconds
const objArr = [];
let [width, height] = [window.innerWidth, window.innerHeight];
const gr = 9.81; // Gravity
const otherForces = -0.0009;

//  Set canvas size
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

  _draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }

  _applyPhysics() {
    // Credit: (https://burakkanber.com/blog/modeling-physics-javascript-gravity-and-drag/)
    const acclX =
      (otherForces *
        this.radius ** 2 *
        this.velocity.x *
        Math.abs(this.velocity.x)) /
      this.mass;
    const acclY =
      (gr +
        otherForces *
          this.radius ** 2 *
          this.velocity.y *
          Math.abs(this.velocity.y)) /
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

window.addEventListener("resize", (e) => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
});

window.addEventListener("click", (ev) => {
  // Get click coordinates
  const { x, y } = ev;

  // Create new ball
  const ball = new Ball(x, y);

  // Draw to canvas
  ball._draw();

  // Add to array of balls
  objArr.push(ball);
});

const frameLoop = () => {
  // Clear the canvas
  ctx.clearRect(0, 0, width, height);
  ctx.save();

  if (objArr.length === 0) return;
  objArr.forEach((ball) => {
    // Apply physics
    ball._applyPhysics();

    // Redraw the ball
    ball._draw();
  });
};

const loop = setInterval(frameLoop, loopInterval);

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
// this._updatePos(acclX, acclY);
// const forces = -0.0003 * Math.PI * this.radius ** 2;
