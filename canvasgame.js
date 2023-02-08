const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");

const text_var = "\u26BD";

let textx = 50;
let texty = 50;
let vtextx = 6;
let vtexty = 6;
let atextx = 0.0;
let atexty = 0.0;

context.font = "30px Arial";
context.fillStyle = "blue";
context.strokeStyle = "red";

function moveText() {
  textx += vtextx;
  texty += vtexty;
  vtextx += atextx;
  vtexty += atexty;

  // check for collision with bottom wall
  if (texty + 28 >= canvas.height) {
    vtexty = -vtexty;
  }
  // check for collision with top wall
  if (texty - 32 <= 0) {
    vtexty = -vtexty;
  }
  
  // check for collision with right wall
  if (textx + context.measureText(text_var).width + 5 >= canvas.width) {
    vtextx = -vtextx;
  }
  // check for collision with left wall
  if (textx <= 0) {
    vtextx = -vtextx;
  }
}


function generateFrame() {
  moveText();
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text_var, textx, texty);
  context.strokeText("", textx, texty);
}

var dt = 1000 / 25;
setInterval(generateFrame, dt);
