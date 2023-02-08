  const canvas = document.getElementById("myCanvas");
  const context = canvas.getContext("2d");

  context.font = "30px Arial";
  context.fillStyle = "blue";
  context.strokeStyle = "red";

  let x = 50;
  let y = 50;
  let velocity = {x: 5, y: 5};

  function update() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    x += velocity.x;
    y += velocity.y;
    context.fillText("Hello, World!", x, y);
    context.strokeText("Hello, World!", x, y);
    requestAnimationFrame(update);
  }

  update();