/*
 * IDB Programming: Code Playground
 *
 */

import * as Util from "../../util.js";

let size = 100;
let timeoutID = null;

// Code that runs over and over again
function loop() {
  Util.setSize(size);
  window.requestAnimationFrame(loop);
}

function grow() {
  size *= 1.01;
  timeoutID = setTimeout(grow, 10);
}

function shrink() {
  if (size >= 100) {
    size *= 0.99;
  }

  timeoutID = setTimeout(shrink, 50);
}

// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  timeoutID = setTimeout(shrink, 10);

  document.addEventListener("keydown", (event) => {
    if (event.code == "KeyB" && !event.repeat) {
      console.log(
        `Key Down - Code ${event.code} | Keycode ${event.keyCode} | Key ${
          event.key
        } | Repeat ${event.repeat ? "" : "not"}`
      );

      if (timeoutID != null) {
        clearTimeout(timeoutID);
      }

      timeoutID = setTimeout(grow, 10);
    }
  });

  document.addEventListener("keyup", (event) => {
    if (event.code == "KeyB" && !event.repeat) {
      console.log(
        `Key Up - Code ${event.code} | Keycode ${event.keyCode} | Key ${
          event.key
        } | Repeat ${event.repeat ? "" : "not"}`
      );

      clearTimeout(timeoutID);
      timeoutID = setTimeout(shrink, 40);
    }
  });

  window.requestAnimationFrame(loop);
}

setup(); // Always remember to call setup()!
