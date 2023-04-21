let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

class PacMan {
  constructor(x, y, radius, speed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
    this.direction = 'right'; // Pac-Man starts moving right by default
    this.speedBoostActive = false; // Initially, the speed boost is not active
  }

  move() {
    // Use a faster speed when the speed boost is active
    const speed = this.speedBoostActive ? this.speed * 5 : this.speed;

    switch (this.direction) {
      case 'right':
        this.x += speed;
        break;
      case 'left':
        this.x -= speed;
        break;
      case 'up':
        this.y -= speed;
        break;
      case 'down':
        this.y += speed;
        break;
    }
  }

  changeDirection(direction) {
    this.direction = direction;
  }

  stop() {
    // Use a faster speed when the speed boost is active
    const speed = this.speedBoostActive ? this.speed * 5 : this.speed;

    switch (this.direction) {
      case 'right':
        this.x -= speed;
        break;
      case 'left':
        this.x += speed;
        break;
      case 'up':
        this.y += speed;
        break;
      case 'down':
        this.y -= speed;
        break;
        }
    this.direction = null;
    }
  }

class Ghost {
    constructor(x, y, radius, color, speed) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.speed = speed;
      this.direction = null;  // Start without a direction
    }
  
    move() {
      if (!this.direction) {
        // Pick a random direction
        const directions = ['right', 'left', 'up', 'down'];
        this.direction = directions[Math.floor(Math.random() * directions.length)];
      }
  
      switch (this.direction) {
        case 'right':
          this.x += this.speed;
          break;
        case 'left':
          this.x -= this.speed;
          break;
        case 'up':
          this.y -= this.speed;
          break;
        case 'down':
          this.y += this.speed;
          break;
      }
    }
  
    changeDirection(direction) {
      this.direction = direction;
    }
  
    stop() {
      this.direction = null;
    }
  }

class Dot {
constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
}
}

class PowerUp {
constructor(x, y, radius, color, effect) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.effect = effect;
}
}

const walls = [
    {x: 0, y: 0, width: 700, height: 50},      // Top wall
    {x: 0, y: 850, width: 700, height: 50},    // Bottom wall
    {x: 0, y: 0, width: 50, height: 900},      // Left wall
    {x: 650, y: 0, width: 50, height: 900},    // Right wall

    {x: 200, y: 375, width: 100, height: 10},  // Top left edge of middle box
    {x: 400, y: 375, width: 100, height: 10},  // Top right edge of middle box
    {x: 200, y: 515, width: 300, height: 10},  // Bottom edge of middle box
    {x: 200, y: 375, width: 10, height: 150},  // Left edge of middle box
    {x: 490, y: 375, width: 10, height: 150},  // Right edge of middle box

    {x: 100, y: 100, width: 50, height: 50},   
    {x: 425, y: 100, width: 50, height: 50},
    {x: 225, y: 100, width: 50, height: 50},  
    {x: 550, y: 100, width: 50, height: 50}, 

    {x: 350, y: 50, width: 10, height: 100}, 
    {x: 350, y: 225, width: 10, height: 75},
    {x: 275, y: 225, width: 150, height: 10},
    {x: 350, y: 600, width: 10, height: 75},
    {x: 275, y: 600, width: 150, height: 10},
    {x: 350, y: 725, width: 10, height: 75},
    {x: 275, y: 725, width: 150, height: 10},

    {x: 225, y: 225, width: 10, height: 100},
    {x: 475, y: 225, width: 10, height: 100},

    {x: 200, y: 675, width: 100, height: 10},
    {x: 405, y: 675, width: 100, height: 10},

    {x: 125, y: 275, width: 100, height: 10},
    {x: 475, y: 275, width: 100, height: 10},

    {x: 125, y: 375, width: 10, height: 225},
    {x: 575, y: 375, width: 10, height: 225},

    {x: 125, y: 675, width: 10, height: 125},
    {x: 575, y: 675, width: 10, height: 125},

  ];

function collidesWithWall(object, key) {
    // Check for collision with each wall
    for (let i = 0; i < walls.length; i++) {
      const wall = walls[i];
      if (object.x + object.radius > wall.x &&
          object.x - object.radius < wall.x + wall.width &&
          object.y + object.radius > wall.y &&
          object.y - object.radius < wall.y + wall.height) {
        // Collision detected
        if (key && key === object.lastKeyPressed) {
          object.stop();
        }
        return true;
      }
    }
    // No collision detected
    return false;
  }
  
function stopOnWallCollision(object) {
    if (collidesWithWall(object)) {
      object.stop();
    }
  }

function collides(pacMan, dotOrPowerUp) {
  // Calculate the distance between Pac-Man and the dot or power up using the Pythagorean theorem
  const distance = Math.sqrt((pacMan.x - dotOrPowerUp.x) ** 2 + (pacMan.y - dotOrPowerUp.y) ** 2);

  // Check if the distance is less than the sum of the radii
  if (distance < pacMan.radius + dotOrPowerUp.radius) {
    if (dotOrPowerUp.type === 'powerUp') {
      // Handle Pac-Man eating a power-up
      console.log('Pac-Man ate a power-up!');
      pacMan.speedBoostActive = true; // Activate the speed boost
      setTimeout(() => pacMan.speedBoostActive = false, 5000); // Deactivate the speed boost after 5 seconds
    }
    return true; // Colliding
  } else {
    return false; // Not colliding
  }
}

// Define a dictionary to map arrow keys to directions
const directionMap = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'up',
    ArrowDown: 'down'
  };
  
// Add an event listener for keydown events
document.addEventListener('keydown', (event) => {
// Check if the pressed key is an arrow key
if (event.key in directionMap) {
    // Update Pac-Man's direction based on the pressed arrow key
    pacMan.direction = directionMap[event.key];
}
});

let pacMan = new PacMan(350, 550, 20, 5); // Create a new Pac-Man instance
pacMan.changeDirection('left'); // Change Pac-Man's direction to the left

let pacManImage = new Image();
pacManImage.src = 'brucey.png';

let ghost = new Ghost(350, 450, 20, 'red', 3);

let ghostImage = new Image();
ghostImage.src = 'card.png';

// Define some dots
const dots = [
  {x: 75, y: 150, radius: 5, color: 'blue', collected: false},
  {x: 75, y: 200, radius: 5, color: 'blue', collected: false},
  {x: 75, y: 250, radius: 5, color: 'blue', collected: false},
  {x: 75, y: 300, radius: 5, color: 'blue', collected: false},
  {x: 75, y: 350, radius: 5, color: 'blue', collected: false},
  {x: 75, y: 400, radius: 5, color: 'blue', collected: false},
  {x: 75, y: 450, radius: 5, color: 'blue', collected: false},
  {x: 75, y: 500, radius: 5, color: 'blue', collected: false},
  {x: 75, y: 550, radius: 5, color: 'blue', collected: false},
  {x: 75, y: 600, radius: 5, color: 'blue', collected: false},
  {x: 75, y: 650, radius: 5, color: 'blue', collected: false},
  {x: 75, y: 700, radius: 5, color: 'blue', collected: false},
  {x: 75, y: 750, radius: 5, color: 'blue', collected: false},

  {x: 625, y: 150, radius: 5, color: 'blue', collected: false},
  {x: 625, y: 200, radius: 5, color: 'blue', collected: false},
  {x: 625, y: 250, radius: 5, color: 'blue', collected: false},
  {x: 625, y: 300, radius: 5, color: 'blue', collected: false},
  {x: 625, y: 350, radius: 5, color: 'blue', collected: false},
  {x: 625, y: 400, radius: 5, color: 'blue', collected: false},
  {x: 625, y: 450, radius: 5, color: 'blue', collected: false},
  {x: 625, y: 500, radius: 5, color: 'blue', collected: false},
  {x: 625, y: 550, radius: 5, color: 'blue', collected: false},
  {x: 625, y: 600, radius: 5, color: 'blue', collected: false},
  {x: 625, y: 650, radius: 5, color: 'blue', collected: false},
  {x: 625, y: 700, radius: 5, color: 'blue', collected: false},
  {x: 625, y: 750, radius: 5, color: 'blue', collected: false},

  {x: 150, y: 825, radius: 5, color: 'blue', collected: false},
  {x: 200, y: 825, radius: 5, color: 'blue', collected: false},
  {x: 250, y: 825, radius: 5, color: 'blue', collected: false},
  {x: 300, y: 825, radius: 5, color: 'blue', collected: false},
  {x: 350, y: 825, radius: 5, color: 'blue', collected: false},
  {x: 400, y: 825, radius: 5, color: 'blue', collected: false},
  {x: 450, y: 825, radius: 5, color: 'blue', collected: false},
  {x: 500, y: 825, radius: 5, color: 'blue', collected: false},
  {x: 550, y: 825, radius: 5, color: 'blue', collected: false},

  {x: 150, y: 175, radius: 5, color: 'blue', collected: false},
  {x: 200, y: 175, radius: 5, color: 'blue', collected: false},
  {x: 250, y: 175, radius: 5, color: 'blue', collected: false},
  {x: 300, y: 175, radius: 5, color: 'blue', collected: false},
  {x: 350, y: 175, radius: 5, color: 'blue', collected: false},
  {x: 400, y: 175, radius: 5, color: 'blue', collected: false},
  {x: 450, y: 175, radius: 5, color: 'blue', collected: false},
  {x: 500, y: 175, radius: 5, color: 'blue', collected: false},
  {x: 550, y: 175, radius: 5, color: 'blue', collected: false},

  {x: 150, y: 350, radius: 5, color: 'blue', collected: false},
  {x: 200, y: 350, radius: 5, color: 'blue', collected: false},
  {x: 250, y: 350, radius: 5, color: 'blue', collected: false},
  {x: 300, y: 350, radius: 5, color: 'blue', collected: false},
  {x: 350, y: 350, radius: 5, color: 'blue', collected: false},
  {x: 400, y: 350, radius: 5, color: 'blue', collected: false},
  {x: 450, y: 350, radius: 5, color: 'blue', collected: false},
  {x: 500, y: 350, radius: 5, color: 'blue', collected: false},
  {x: 550, y: 350, radius: 5, color: 'blue', collected: false},

  {x: 150, y: 550, radius: 5, color: 'blue', collected: false},
  {x: 200, y: 550, radius: 5, color: 'blue', collected: false},
  {x: 250, y: 550, radius: 5, color: 'blue', collected: false},
  {x: 300, y: 550, radius: 5, color: 'blue', collected: false},
  {x: 350, y: 550, radius: 5, color: 'blue', collected: false},
  {x: 400, y: 550, radius: 5, color: 'blue', collected: false},
  {x: 450, y: 550, radius: 5, color: 'blue', collected: false},
  {x: 500, y: 550, radius: 5, color: 'blue', collected: false},
  {x: 550, y: 550, radius: 5, color: 'blue', collected: false},

  {x: 150, y: 250, radius: 5, color: 'blue', collected: false},
  {x: 200, y: 250, radius: 5, color: 'blue', collected: false},
  {x: 250, y: 250, radius: 5, color: 'blue', collected: false},
  {x: 300, y: 250, radius: 5, color: 'blue', collected: false},
  {x: 400, y: 250, radius: 5, color: 'blue', collected: false},
  {x: 450, y: 250, radius: 5, color: 'blue', collected: false},
  {x: 500, y: 250, radius: 5, color: 'blue', collected: false},
  {x: 550, y: 250, radius: 5, color: 'blue', collected: false},

  {x: 150, y: 650, radius: 5, color: 'blue', collected: false},
  {x: 200, y: 650, radius: 5, color: 'blue', collected: false},
  {x: 250, y: 650, radius: 5, color: 'blue', collected: false},
  {x: 300, y: 650, radius: 5, color: 'blue', collected: false},
  {x: 400, y: 650, radius: 5, color: 'blue', collected: false},
  {x: 450, y: 650, radius: 5, color: 'blue', collected: false},
  {x: 500, y: 650, radius: 5, color: 'blue', collected: false},
  {x: 550, y: 650, radius: 5, color: 'blue', collected: false},

  {x: 150, y: 75, radius: 5, color: 'blue', collected: false},
  {x: 200, y: 75, radius: 5, color: 'blue', collected: false},
  {x: 250, y: 75, radius: 5, color: 'blue', collected: false},
  {x: 300, y: 75, radius: 5, color: 'blue', collected: false},
  {x: 400, y: 75, radius: 5, color: 'blue', collected: false},
  {x: 450, y: 75, radius: 5, color: 'blue', collected: false},
  {x: 500, y: 75, radius: 5, color: 'blue', collected: false},
  {x: 550, y: 75, radius: 5, color: 'blue', collected: false},
  
];

let score = 0;

function drawDots() {
  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i];
    if (!dot.collected) {
      context.beginPath();
      context.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
      context.fillStyle = dot.color;
      context.fill();
      // check if Pac-Man has collided with this dot
      const distance = Math.sqrt((pacMan.x - dot.x) ** 2 + (pacMan.y - dot.y) ** 2);
      if (distance < pacMan.radius + dot.radius) {
        dot.collected = true;
        score += 10;
      }
    }
  }
}

const powerups = [
  new PowerUp(75, 75, 10, 'red', 'increaseSpeed'), // top-left corner
  new PowerUp(625, 75, 10, 'red', 'increaseSpeed'), // top-right corner
  new PowerUp(75, 825, 10, 'red', 'increaseSpeed'), // bottom-left corner
  new PowerUp(625, 825, 10, 'red', 'increaseSpeed') // bottom-right corner
];

function renderPowerups() {
  powerups.forEach(powerup => {
    context.beginPath();
    context.arc(powerup.x, powerup.y, powerup.radius, 0, 2 * Math.PI);
    context.fillStyle = powerup.color;
    context.fill();
  });
}

let numImagesLoaded = 0;

// Start the game loop
function gameLoop() {
    // Update the game state
    pacMan.move();
    ghost.move();

    // Stop Pac-Man and ghosts when they hit a wall
    stopOnWallCollision(pacMan);
    stopOnWallCollision(ghost);
    
    // Check for collisions
    if (collides(pacMan, ghost)) {
      // Handle Pac-Man getting caught by the ghost
      console.log('Pac-Man caught!');
      gameOver();
      return;
    }

    // Check if all dots have been collected
    const allDotsCollected = dots.every((dot) => dot.collected);
    if (allDotsCollected) {
      // Display "You win!" screen
      gameWon();
      return;
    }
  
    if (collides(pacMan, Dot)) {
      // Handle Pac-Man eating a dot
      console.log('Pac-Man ate a dot!');
    }
  
    if (collides(pacMan, PowerUp)) {
      // Handle Pac-Man eating a power-up
      console.log('Pac-Man ate a power-up!');
    }
  
    // Draw the game objects on the canvas
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    context.drawImage(pacManImage, pacMan.x - pacMan.radius, pacMan.y - pacMan.radius, pacMan.radius * 2, pacMan.radius * 2);
    context.drawImage(ghostImage, ghost.x - ghost.radius, ghost.y - ghost.radius, ghost.radius * 2, ghost.radius * 2);
    context.beginPath();
    context.arc(Dot.x, Dot.y, Dot.radius, 0, Math.PI * 2);
    context.fillStyle = Dot.color;
    context.fill();
    drawDots();
    context.beginPath();
    context.arc(PowerUp.x, PowerUp.y, PowerUp.radius, 0, Math.PI * 2);
    context.fillStyle = PowerUp.color;
    context.fill();
    renderPowerups();
    for (let i = 0; i < walls.length; i++) {
        const wall = walls[i];
        context.fillStyle = 'black'; // Set the fill color to black
        context.fillRect(wall.x, wall.y, wall.width, wall.height); // Draw the wall
        }
  
    // Check if all images have finished loading
    if (++numImagesLoaded === 2) {
      // All images have finished loading, so draw them on the canvas
      context.drawImage(pacManImage, pacMan.x - pacMan.radius, pacMan.y - pacMan.radius, pacMan.radius * 2, pacMan.radius * 2);
      context.drawImage(ghostImage, ghost.x - ghost.radius, ghost.y - ghost.radius, ghost.radius * 2, ghost.radius * 2);
    }
  
    // Request the next frame of the game loop
    window.requestAnimationFrame(gameLoop);
  }
  
// Start the game loop
window.requestAnimationFrame(gameLoop);

function gameWon() {
  // Draw a "you win" screen
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = 'white';
  context.font = '48px Arial';
  context.fillText('yay', canvas.width/2 - 120, canvas.height/2 - 50);
  context.font = '24px Arial';
  context.fillText('Press "R" to restart', canvas.width/2 - 110, canvas.height/2 + 60);

  // Listen for the "R" key to restart the game
  document.addEventListener('keydown', function(event) {
    if (event.code === 'KeyR') {
      restartGame();
    }
  });
}

function gameOver() {
  // Draw a game over screen
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = 'white';
  context.font = '48px Arial';
  context.fillText('Game Over', canvas.width/2 - 120, canvas.height/2 - 50);
  context.font = '24px Arial';
  context.fillText('Your score: ' + score, canvas.width/2 - 80, canvas.height/2 + 20);
  context.fillText('Press "R" to restart', canvas.width/2 - 110, canvas.height/2 + 60);

  // Listen for the "R" key to restart the game
  document.addEventListener('keydown', function(event) {
    if (event.code === 'KeyR') {
      restartGame();
    }
  });
}


function restartGame() {
  // Reload the page to restart the game
  location.reload();
}