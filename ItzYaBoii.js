window.onload = () => {
  const btn = document.getElementById("jump");
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  let canvW = canvas.width;
  let canvH = canvas.height;
  let ballR = 30;
  let ballx = 200;
  let bally = canvH / 2 - ballR;
  let lost = false;
  let stopGame = false;
  let pause = false;
  let recSpeed = 1;
  let ballSpeed = 30;
  const coin = new Image();
  coin.src = "coin.png";

  document.onkeydown = function (event) {
    if (!stopGame) {
      if (event.code === "ArrowLeft" || event.code === "KeyA") {
        // Left arrow key pressed
        if (ballx > ballR) {
          ballx -= ballSpeed;
        }
      } else if (event.code === "ArrowUp" || event.code === "KeyW") {
        // Up arrow key pressed
        if (bally > ballR) {
          bally -= ballSpeed;
          gravity = 25;
        }
      } else if (event.code === "ArrowRight" || event.code === "KeyD") {
        // Right arrow key pressed
        if (ballx < canvW - ballR) {
          ballx += ballSpeed;
        }
      } else if (
        (event.code === "ArrowLeft" && event.code === "ArrowUp") ||
        (event.code === "KeyA" && event.code === "KeyW")
      ) {
        if (ballx > ballR) {
          ballx -= ballSpeed;
        }
        bally -= ballSpeed;
      } else if (
        (event.code === "ArrowRight" && event.code === "ArrowUp") ||
        (event.code === "KeyD" && event.code === "KeyW")
      ) {
        if (ballx < canvW - ballR) {
          ballx += ballSpeed;
        }
        bally -= ballSpeed;
      } else if (event.code === "ArrowRight" && event.code === "ArrowLeft") {
      } else if (event.code === "ArrowDown" || event.code === "KeyS") {
        if (bally < canvH - ballR) {
          bally += ballSpeed;
        }
      }
    }
  };

  let collision = false;
  let t = Date.now();
  let coinr =50;
  let coinx = Math.random() * (canvW - coinr);
  let coiny = Math.random() * (canvH - coinr);
  let score = 0;
  let gravity = 25;
  let recx = canvW;
  let rech = 100;
  let recy = 0;
  let recw = 50;
  let min = 100;
  let max = 300;

  if (!lost) {
    document.addEventListener("keydown", function (event) {
      if (event.code === "Escape") {
        stopGame = !stopGame;
        pause = !pause;
        if (!stopGame && !pause) {
          t = Date.now(); // Reset the time reference
          draw(); // Resume the game by calling the draw function
        }
      }
    });
  }

  document.getElementById("resetSpeed").onclick=()=>{
    recSpeed=1;
    showRecSpeed.textContent=recSpeed;
  }

  var showRecSpeed=document.getElementById("recSpeed");
  showRecSpeed.textContent=recSpeed;
  var plusSpeed=document.getElementById("plusSpeed");
  var minusSpeed=document.getElementById("minusSpeed");
  plusSpeed.onclick=()=>{
    recSpeed++;
    showRecSpeed.textContent=recSpeed;
  }
  minusSpeed.onclick=()=>{
    if(recSpeed>1){
      recSpeed--;
      showRecSpeed.textContent=recSpeed;
    }
  }

  
  function draw() {
    showRecSpeed.textContent=recSpeed;
    const timePassed = (Date.now() - t) / 1000;
    t = Date.now();
    const fps = Math.round(1 / timePassed);
    context.clearRect(0, 0, canvW, canvH);
    if (bally <= canvH - ballR) {
      gravity += 50 * timePassed;
      bally += gravity * timePassed;
    }
    context.beginPath();
    context.arc(ballx, bally, ballR, 0, 2 * Math.PI);
    context.fillStyle = "red";
    context.fill();
    context.stroke();

    context.beginPath();
    context.arc(coinx, coiny, 20, 0, 2 * Math.PI);
    context.fillStyle = "#e3c228";
    context.fill();
    context.drawImage(coin, coinx - 20, coiny - 20, 40, 40);

    context.beginPath();
    context.rect(recx, canvH, recw, -rech);
    context.fillStyle = "#256D85";
    context.fill();
    context.stroke();
    recx -= recSpeed;

    if (recx <= 0) {
      recx = canvW;
      rech = Math.floor(Math.random() * (max - min) + min);
    }

    context.font = "20px courier";
    context.fillStyle = "white";
    context.fillText("FPS: " + fps, 20, 30);
    context.font = "25px courier";
    context.fillStyle = "white";
    context.fillText("Score: " + score, 20, 60);

    // Check if a collision has occurred
    if (
      ballx + ballR >= recx && // Right edge of the ball is to the right of the left edge of the rectangle
      ballx - ballR <= recx + recw && // Left edge of the ball is to the left of the right edge of the rectangle
      bally - ballR <= canvH && // Top edge of the ball is above the bottom edge of the rectangle
      bally + ballR >= canvH - rech // Bottom edge of the ball is below the top edge of the rectangle
    ) {
      // Collision detected
      // Perform actions accordingly
      collision = true;
      stopGame = true;
      score = 0;
    }
    if (bally > canvH - ballR) {
      score = 0;
      lost = true;
      stopGame = true;
      
    }

    const distance = Math.sqrt(
      Math.pow(ballx - coinx, 2) + Math.pow(bally - coiny, 2)
    );

    if (distance < ballR + 20) {
      // Collision detected
      score++;
      coinx = Math.random() * (canvW - coinr);
      coiny = Math.random() * (canvH - coinr);
    }

    if (!stopGame) {
      window.requestAnimationFrame(draw);
    } else if (stopGame && pause) {
      context.fillStyle = "rgba(0, 0, 0, 0.5)"; // Semi-transparent black
      context.fillRect(0, 0, canvW, canvH); // Draw overlay rectangle
      context.font = "90px bangers";
      context.fillStyle = "white";
      context.strokeStyle = "black";
      context.lineWidth = 2.5;
      context.fillText("Paused", 200, 210);
      context.strokeText("Paused", 200, 210) // Toggle the pause state when the Space key is pressed
      context.lineWidth = 1;
    } else if (stopGame && (lost || collision)) {
      context.fillStyle = "rgba(0, 0, 0, 0.5)"; // Semi-transparent black
      context.fillRect(0, 0, canvW, canvH); // Draw overlay rectangle
      context.font = "90px bangers";
      context.strokeStyle = "black";
      context.lineWidth = 1.7;
      context.fillStyle = "white";
      context.fillText("You Lost", 170, 210); // Display "You Lost" text
      context.strokeText("You Lost", 170, 210);
      context.font = "30px bangers";
      context.fillStyle = "white";
      context.fillText("Press Space to Try Again", 170, 290);
      context.strokeText("Press Space to Try Again", 170, 290);
      context.lineWidth = 1;
      document.addEventListener("keydown", function (event) {
        if (event.code === "Space" && (collision || lost)) {
          resetGame();
          // Call draw function to restart the game
          window.requestAnimationFrame(draw); 
        }
      });
    }
  }
  

  function resetGame() {
    recSpeed=1;
    ballx = 200;
    bally = canvH / 2 - ballR;
    stopGame = false;
    collision = false;
    pause = false;
    lost = false;
    gravity = 25;
    score = 0;
    t = Date.now();
    recx = canvW;
    rech = 100;
    coinx = Math.random() * (canvW - 50);
    coiny = Math.random() * (canvH - 50);
  }

  context.font = "90px bangers";
  context.fillStyle = "white";
  context.strokeStyle = "black";
  context.lineWidth = 5;
  context.strokeText("Jumper Game", 90, 200);
  context.fillText("Jumper Game", 90, 200);
  context.lineWidth = 1;
 
  btn.onclick = function () {
    btn.style.display = "none";
    context.clearRect(0, 0, canvas.width, canvas.height);
    resetGame();
    draw();
  };
};
