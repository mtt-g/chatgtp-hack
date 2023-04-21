const container = document.getElementById("container");
const paddleA = document.getElementById("paddleA");
const paddleB = document.getElementById("paddleB");
const ball = document.getElementById("ball");
const playerScore = document.getElementById("playerScore");
const computerScore = document.getElementById("computerScore");
const winner = document.getElementById("winner");
const playAgainButton = document.getElementById("play-again");

const paddleHeight = 80;
const paddleSpeedA = 10;
const paddleSpeedB = 3;
const ballSpeed = 5;
const ballWidth = 15;
const ballHeight = 15;
const winningScore = 10;

let playerScoreValue = 0;
let computerScoreValue = 0;
let gameOver = false;

let paddleAY = 200;
let paddleBY = 200;

let ballX = container.clientWidth / 2;
let ballY = container.clientHeight / 2;
let ballXSpeed = ballSpeed;
let ballYSpeed = ballSpeed;

function movePaddles() {
  // move paddle A
  if (paddleAY > 0 && keys.KeyW) {
    paddleAY -= paddleSpeedA;
  }
  if (paddleAY < container.clientHeight - paddleHeight && keys.KeyS) {
    paddleAY += paddleSpeedA;
  }
  paddleA.style.top = paddleAY + "px";

  // move paddle B
  if (paddleBY > ballY) {
    paddleBY -= paddleSpeedB;
  }
  if (paddleBY < ballY) {
    paddleBY += paddleSpeedB;
  }
  paddleB.style.top = paddleBY + "px";
}

function moveBall() {
  ballX += ballXSpeed;
  ballY += ballYSpeed;

  // check for collisions with walls
  if (ballY <= 0 || ballY + ballHeight >= container.clientHeight) {
    ballYSpeed = -ballYSpeed;
  }

  // check for collisions with paddles
  var paddleAXRight = parseInt(window.getComputedStyle(paddleA).left) + parseInt(window.getComputedStyle(paddleA).width);
  if (ballX + ballXSpeed <= paddleAXRight && ballY + ballHeight >= parseInt(window.getComputedStyle(paddleA).top) && ballY <= parseInt(window.getComputedStyle(paddleA).top) + paddleHeight) {
    ballXSpeed = -ballXSpeed;
  }

  var paddleBXLeft = parseInt(window.getComputedStyle(paddleB).left);
  var paddleBYBottom = parseInt(window.getComputedStyle(paddleB).top) + parseInt(window.getComputedStyle(paddleB).height);
  if (ballX + ballWidth >= paddleBXLeft && ballY + ballHeight >= parseInt(window.getComputedStyle(paddleB).top) && ballY <= paddleBYBottom) {
    ballXSpeed = -ballXSpeed;
  }

  // check for game over
  if (ballX <= 0) {
    computerScoreValue++;
    computerScore.textContent = computerScoreValue;
    resetBall();
  } else if (ballX + ballWidth >= container.clientWidth) {
    playerScoreValue++;
    playerScore.textContent = playerScoreValue;
    resetBall();
  }

  // check for winning score
  if (playerScoreValue >= winningScore || computerScoreValue >= winningScore) {
    gameOver = true;
    winner.textContent = playerScoreValue > computerScoreValue ? "Player Wins!" : "Computer Wins!";
    winner.style.display = "block"
    playAgainButton.style.display = "block"; // display the button
  }
  
  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";
}
  
function resetBall() {
  ballX = container.clientWidth / 2;
  ballY = container.clientHeight / 2;
  ballXSpeed = -ballXSpeed;
  ballYSpeed = Math.floor(Math.random() * 8) - 4;
}
  
function playAgain() {
  playerScoreValue = 0;
  computerScoreValue = 0;
  playerScore.textContent = 0;
  computerScore.textContent = 0;
  winner.textContent = "";
  winner.style.display = "none"
  playAgainButton.style.display = "none";
  gameOver = false;
  resetBall();
}
  
  let keys = {};
  window.addEventListener("keydown", function (event) {
  keys[event.code] = true;
  });
  window.addEventListener("keyup", function (event) {
  keys[event.code] = false;
  });
  
  setInterval(function () {
    if (!gameOver) {
      movePaddles();
      moveBall();
    }
  }, 10);
  
playAgainButton.addEventListener("click", playAgain);