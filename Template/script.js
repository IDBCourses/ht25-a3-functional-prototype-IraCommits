/*
 * IDB Programming: Code Playground
 *
 */

import * as Util from "./util.js";
// DOM
const game = document.getElementById("game");
const circles = [];

// Swipe keys
let previousKey = null;
let currentKey = null;
const quertyKeys = ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY"];

// Player's state
let hue = 55; // yellow
let size = 250; //player's initial size
let timeoutID = null; //timer id
let resetKeysTimeoutID = null; // timer for reseting keys
let playerX = (game.clientWidth - size) / 2; // players position from left to center
let playerY = (game.clientHeight - size) / 2; // players's podition from top to center
let score = 0; // number of circles eaten
let gameEnded = false; // identifier for win/lose

// score text
const scoreEl = document.createElement("div");
scoreEl.style.position = "absolute";
scoreEl.style.left = "15px";
scoreEl.style.top = "20px";
scoreEl.style.fontFamily = "sans-serif";
scoreEl.style.fontSize = "25px";
scoreEl.style.fontWeight = "700";
scoreEl.style.color = "#fff";
scoreEl.style.zIndex = "999";
scoreEl.style.textShadow = "0 2px 4px rgba(0,0,0,0.35)";
scoreEl.textContent = `Score: ${score}`;
document.body.appendChild(scoreEl);

// HELPERS
function resetKeys() {
  previousKey = null;
  currentKey = null;
}

function clamp(v, min, max) {
  //sets max & min limits for v
  return Math.max(min, Math.min(max, v));
}

function playerRectangle() {
  //player obj, position, size
  return { x: playerX, y: playerY, size };
}

function updateScore() {
  scoreEl.textContent = `Score: ${score}`;
}

// returns max player size based on game width
function maxPlayerSize() {
  const containerWidth = game.clientWidth;
  const maxRadius = containerWidth / 15;
  return maxRadius * 2;
}

// ends the game and shows message
function endGame(text, className = "msg") {
  if (gameEnded) return;
  gameEnded = true;
  // stop timers
  clearTimeout(timeoutID);
  const msg = document.createElement("div");
  msg.textContent = text;
  game.innerHTML = "";
  msg.className = className;
  document.body.appendChild(msg);
}

//  CIRCLES (SPAWN + MOTION )

function spawnCircles(count = 15) {
  for (let i = 0; i < count; i++) {
    const circle = Util.createThing(`circle${i}`, "thing");

    // random size between 30–75 px
    const size = Math.random() * 45 + 30;
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;

    // random horizontal start position X, start at random Y position inside game container
    const maxX = game.clientWidth - size;
    const maxY = game.clientHeight - size;
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;

    // vertical (Y) movement only, deltaY
    // each circle gets random speed (0.5–3 px per frame) along Y-axis
    const dy = (Math.random() * 2.5 + 0.5) * (Math.random() < 0.5 ? 1 : -1);

    // save circle info for array
    circles.push({ el: circle, x, y, dy, size });
  }

  // animation loop for circles  
  function animateCircles() {
    const height = game.clientHeight;

    circles.forEach((c) => {
      // move only on Y-axis
      c.y += c.dy;

      // bounce vertically (top and bottom walls)
      if (c.y <= 0 || c.y >= height - c.size) {
        c.dy *= -1; // reverse direction when hitting top/bottom
      }

      // apply new position to DOM
      c.el.style.left = `${c.x}px`;
      c.el.style.top = `${c.y}px`;
    });

    requestAnimationFrame(animateCircles); // keeps circles moving (animation loop)
  }

  animateCircles();
}

//  SWIPE MOVEMENT
// checks which way player swiped (left or right)
function swipeDirection() {
  const prevIndex = quertyKeys.indexOf(previousKey);
  const currIndex = quertyKeys.indexOf(currentKey);

  if (currIndex < 0 || prevIndex < 0) return 0; // no move
  if (currIndex > prevIndex) return 1; // right
  if (currIndex < prevIndex) return -1; // left
  return 0;
}

// moves player in given direction
function movePlayer(direction) {
  const step = 50; // how far to move
  playerX += direction * step; //update position
  playerX = clamp(playerX, 0, game.clientWidth - size); // stay inside screen
  Util.setPositionPixels(playerX, playerY); //apply new position
}

// CATCHING
function catchCircle(player) {
  // function checks if the random circle and player has touched
  for (let i = circles.length - 1; i >= 0; i--) {
    //we are sorting through array from the end to the start

    const circle = circles[i]; // we take the current circle

    // the center point of the circle and player
    const playerCenterX = player.x + player.size / 2; // player's center X
    const playerCenterY = player.y + player.size / 2; // player's center Y
    const circleCenterX = circle.x + circle.size / 2; // circle center X
    const circleCenterY = circle.y + circle.size / 2; // circle center Y

    // distance between centers of the circles and player
    const distanceX = playerCenterX - circleCenterX; // diff X
    const distanceY = playerCenterY - circleCenterY; // diff Y
    const distance = Math.hypot(distanceX, distanceY); //hypotenuse between two points √(distanceX² + distanceY²) Pythagoras

    // radius of the elements
    const playerRadius = player.size / 2; //radius of the player
    const circleRadius = circle.size / 2; // radius of the circle (food)

    //  OVERLAP => if DISTANCE IS < BOTH radiuses = touching = EATING THE CIRCLE
    if (distance < playerRadius + circleRadius) {
      circle.el.remove(); //delete circle from the array visually, it's visually gone
      circles.splice(i, 1); // circle is not in the list, program does not track it anymore. logically gone
      // SCORE + FEEDBACK
      score += 1;
      updateScore();

      // Growth after eating the food circle
      const newSize = size + circle.size;
      size = Math.min(newSize, maxPlayerSize()); // limit max size to grow
      Util.setSize(size); //update size
      updateHueBySize(); //change color with size
      Util.setColour(hue, 100, 50, 1); //apply color
      if (circles.length === 0) {
        endGame("WINNER✨", "msg");
      }
    }
  }
}

function updateHueBySize() {
  const criticalSize = 25; // when size = 50 then hue = 0 (red)
  const maxSize = maxPlayerSize(); // when size =  biggest player size  → hue = 55 (yellow)

  const ratio = Math.max(
    0,
    Math.min(1, (size - criticalSize) / (maxSize - criticalSize)) // get size ratio between small and big
  );

  hue = ratio * 55;
}

function shrink() {
  if (gameEnded) return;
  if (size > 1) {
    size *= 0.996; // gradually decreases
    updateHueBySize();
    Util.setSize(size);
    Util.setColour(hue, 100, 50, 1);
    const player = document.getElementById("thing0");
    player.style.boxShadow = `0 0 20px hsl(${hue}, 100%, 50%), 0 0 40px hsl(${hue}, 100%, 50%)`; //of the player color
    timeoutID = setTimeout(shrink, 25);
  } else {
    size = 0;
    Util.setSize(size);
    Util.setColour(0, 100, 40, 1); //red
    endGame("GAME OVER", "goMsg");
    game.style.opacity = "0.2";
    game.style.backgroundColor = "red";
  }
}

function restartGame() {
  // reload the page to restart the game
  location.reload();
}
// Code that runs over and over again
function loop() {
  Util.setSize(size); // current size of player
  Util.setPositionPixels(playerX, playerY); // coordinates for the player (x,y)
  window.requestAnimationFrame(loop);
}
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  Util.setColour(hue, 100, 50, 1); // set the player's initial yellow color

  timeoutID = setTimeout(shrink, 60); // after  1.5s  the player starts to shrink

  document.addEventListener("keydown", (event) => {
    previousKey = currentKey;
    currentKey = event.code;

    // swipe motion
    const direction = swipeDirection(); // check swippe
    if (direction !== 0) movePlayer(direction); //move player

    // catch with KeyC
    if (event.code === "KeyC" && !event.repeat) {
      catchCircle(playerRectangle());
    }

    // restart with Space
    if (event.code === "Space" && gameEnded) {
      restartGame();
    }

   if (direction !== 0) {
    if (timeoutID != null) {
      clearTimeout(timeoutID);
    }
    timeoutID = setTimeout(shrink, 60);
  }
});
  document.addEventListener("keyup", (e) => {
    resetKeysTimeoutID = setTimeout(resetKeys, 1000);
  });
  
  spawnCircles(30);

  window.requestAnimationFrame(loop); //start game loop
}

setup();
