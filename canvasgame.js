const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");

const text_var = "Mars";

let textx = 50;
let texty = 50;
let vtextx = 3;
let vtexty = 3;
let atextx = 0.0;
let atexty = 0.5;

context.font = "50px Arial";
context.fillStyle = "blue";
context.strokeStyle = "red";

function moveText() {
  textx += vtextx;
  texty += vtexty;
  vtextx += atextx;
  vtexty += atexty;

  // check for collision with bottom wall
  if (texty + 35 >= canvas.height) {
	texty -= vtexty;
    vtexty = -vtexty;
  }
  // check for collision with top wall
  if (texty - 25 <= 0) {
	texty -= vtexty;
    vtexty = -vtexty;
  }
  
  // check for collision with right wall
  if (textx + context.measureText(text_var).width + 5 >= canvas.width) {
	textx -= vtextx
    vtextx = -vtextx;
  }
  // check for collision with left wall
  if (textx + 5 <= 0) {
	textx -= vtextx
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

document.onkeydown = function(button)
{
	if(button.keyCode == 39)
	{
		atextx = atextx + 1;
	}
	if(button.keyCode == 37)
	{
		atextx = atextx - 1;
	}
}

document.onkeyup = function(button)
{
	if(button.keyCode == 39)
	{
		atextx = 0;
	}
	if(button.keyCode == 37)
	{
		atextx = 0;
	}
}

