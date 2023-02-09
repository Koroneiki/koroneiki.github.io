const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");

const text_var = "\u26BD";

let textx = 100;
let texty = 60;
let vtextx = 0.6;
let vtexty = 0.3;
let atextx = 0.0;
let atexty = 0.05;

var damping = 0.8;
var ground_friction = 0.97;

context.font = "50px Arial";
context.fillStyle = "blue";
context.strokeStyle = "red";

function moveText() {
  textx += vtextx;
  texty += vtexty;
  vtextx += atextx;
  vtexty += atexty;

// check for collision with bottom wall
  if (texty >= canvas.height) {
    texty -= vtexty;
    vtexty = -vtexty*damping;
    atexty *= 1.1;
    if (atexty > 0.3) {
      atexty = 0.3;
	  vtexty = 0;
	  vtextx = 0;
    }
  }

  // check for collision with top wall
  if (texty - 35 <= 0) {
    texty -= vtexty;
    vtexty = -vtexty*damping;
  }
  
  // check for collision with right wall
  if (textx + context.measureText(text_var).width + 5 >= canvas.width) {
    textx -= vtextx;
    vtextx = -vtextx*damping;
  }
  // check for collision with left wall
  if (textx + 5 <= 0) {
    textx -= vtextx;
    vtextx = -vtextx*damping;
  }
}

var mousepress = false;
var mausx_current, mausy_current;
var mausx_recent, mausy_recent;

function generateFrame() {
  if (mousepress) {
	  textx = mausx_current;
	  texty = mausy_current;
	  vtextx = mausx_current - mausx_recent;
	  vtexty = mausy_current - mausy_recent;
	  mausx_recent = mausx_current;
	  mausy_recent = mausy_current;
  }
  else {
	  moveText();
  }
  moveText();
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text_var, textx, texty);
  context.strokeText("", textx, texty);
}


canvas.onmousedown = function(event) {
  mousepress = true;
  canvas.style.cursor = "grabbing";
  var mpos = getCanvasMousePosition(event.clientX,event.clientY);
  document.getElementById("mausx").innerHTML = "Maus-x: " + mpos.x;
  document.getElementById("mausy").innerHTML = "Maus-y: " + mpos.y;
  mausx_current = mpos.x;
  mausy_current = mpos.y;
  mausx_recent = mpos.x;
  mausy_recent = mpos.y;
}

canvas.onmouseup = function(event) {
  mousepress = false;
  canvas.style.cursor = "grab";
  var mpos = getCanvasMousePosition(event.clientX,event.clientY);
  document.getElementById("mausx").innerHTML = "Maus-x: " + mpos.x;
  document.getElementById("mausy").innerHTML = "Maus-y: " + mpos.y;
}

canvas.onmousemove = function(event) {
  var mpos = getCanvasMousePosition(event.clientX,event.clientY);
  document.getElementById("mausx").innerHTML = "Maus-x: " + mpos.x;
  document.getElementById("mausy").innerHTML = "Maus-y: " + mpos.y;
  mausx_current = mpos.x;
  mausy_current = mpos.y;
}


canvas.onmouseout = canvas.onmouseleave = function() {
  document.getElementById("mausx").innerHTML = "Maus-x: ";
  document.getElementById("mausy").innerHTML = "Maus-y: ";
}

function getCanvasMousePosition(px,py) {
  var box = canvas.getBoundingClientRect();
  var pos = 
  {
    x: px - box.left,
    y: py - box.top
  }
  return pos;
}

var dt = 1000 / 100;
setInterval(generateFrame, dt);

