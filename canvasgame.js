const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");

const text_var = "\u26BD";

let textx = 100;
let texty = 60;
let vtextx = 1;
let vtexty = 0.6;
let atextx = 0.0;
let atexty = 0.05;

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
    vtexty = -vtexty * 0.9;
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
    vtexty = -vtexty;
  }
  
  // check for collision with right wall
  if (textx + context.measureText(text_var).width + 5 >= canvas.width) {
    textx -= vtextx;
    vtextx = -vtextx;
  }
  // check for collision with left wall
  if (textx + 5 <= 0) {
    textx -= vtextx;
    vtextx = -vtextx;
  }
}


function generateFrame() {
  moveText();
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text_var, textx, texty);
  context.strokeText("", textx, texty);
}


var mousepress = false;
var mausx_current, mausy_current;
var mausx_recent, mausy_recent;

canvas.onmousedown = function(event) {
	mousepress = false;
	canvas.style.cursor = "grabbing";
	var mpos = getCanvasMousePosition(event.clientX,event.clientY);
	document.getElementbyID("mausx").innerHTML = "Maus-x: " + mpos.x;
	document.getElementById("mausy").innerHTML = "Maus-y: " + mpos.y;
	mausx_current = pos.x;
	mausy_current = pos.y;
}

canvas.onmouseup = function(event) {
	mousepress = false;
	canvas.style.cursor = "grab";
	var mpos = getCanvasMousePosition(event.clientX,event.clientY);
	document.getElementbyID("mausx").innerHTML = "Maus-x: " + mpos.x;
	document.getElementById("mausy").innerHTML = "Maus-y: " + mpos.y;
	mausx_current = pos.x;
	mausy_current = pos.y;
}

canvas.onmousemove = function(event) {
  var mpos = getCanvasMousePosition(event.clientX,event.clientY);
  document.getElementById("mausx").innerHTML = "Maus-x: " + mpos.x;
  document.getElementById("mausy").innerHTML = "Maus-y: " + mpos.y;
  mausx_current = pos.x;
  mausy_current = pos.y;
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

