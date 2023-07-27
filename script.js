window.onload = () => {
  // Canvas and context
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  let canvW = canvas.width;
  let canvH = canvas.height;

  // Ball properties
  let ballR = 30;
  let ballx = 200;
  let bally = canvH / 2 - ballR;
  let ballSpeed = 30;
  let gravity = 25;

  // Game state
  let lost = false;
  let stopGame = false;
  let pause = false;
  let collision = false;
  let t = Date.now();
  let difficulty = "easy";

  // Coin properties
  const coin = new Image();
  coin.src = "coin.png";
  let coinr = 50;
  let coinx = Math.random() * (canvW - coinr);
  let coiny = Math.random() * (canvH - coinr);

  // Rectangle height range
  let min = 100;
  let max = 300;

  // Rectangle properties
  // let recx = canvW;
  // let rech = Math.floor(Math.random() * (max - min) + min);
  // let recw = 50;
  // let recy = 0;
  // let rech2 = Math.floor(Math.random() * (max - min) + min);

  // Speed control
  let recSpeed = 1;

  function Rectangle(recx, rech, recw, recy, recSpeed) {
    this.recx = recx;
    this.rech = rech;
    this.recw = recw;
    this.recy = recy;
    this.recSpeed = recSpeed;
    this.say = (x) => {
      console.log(this.recx);
    };
    this.moveRec = () => {
      this.recx -= this.recSpeed;
      if (this.recx <= 0) {
        this.recx = canvW;
        this.rech = Math.floor(Math.random() * (max - min) + min);
      }
    };

    this.drawRec = () => {
      context.beginPath();
      context.rect(this.recx, this.recy, this.recw, -this.rech);
      context.fillStyle = "#256D85";
      context.fill();
      context.stroke();
      console.log("drawing");
    };

    this.resetRec = () => {
      this.recx = recx;
      this.rech = rech;
      this.recw = recw;
      this.recy = recy;
      this.recSpeed = recSpeed;
    };

    // Collision detection
    this.detectCollision = () => {
      if (
        ballx + ballR >= this.recx && // Right edge of the ball is to the right of the left edge of the rectangle
        ballx - ballR <= this.recx + this.recw && // Left edge of the ball is to the left of the right edge of the rectangle
        bally - ballR <= canvH && // Top edge of the ball is above the bottom edge of the rectangle
        bally + ballR >= canvH - this.rech // Bottom edge of the ball is below the top edge of the rectangle
      ) {
        return true;
      } else {
        return false;
      }
    };
  }

  let easyRec = new Rectangle(
    canvW,
    Math.floor(Math.random() * (max - min) + min),
    50,
    canvH,
    recSpeed
  );

  // Score
  let score = 0;

  // Element references
  const startBtn = document.getElementById("jump");
  const showRecSpeed = document.getElementById("recSpeed");
  const plusSpeed = document.getElementById("plusSpeed");
  const minusSpeed = document.getElementById("minusSpeed");
  const easyBtn = document.getElementById("easy");
  const mediumBtn = document.getElementById("medium");
  const hardBtn = document.getElementById("hard");

  // Movement event handler
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

  // Escape key event listener
  document.addEventListener("keydown", function (event) {
    if (!lost && event.code === "Escape") {
      stopGame = !stopGame;
      pause = !pause;
      if (!stopGame && !pause) {
        t = Date.now(); // Reset the time reference
        draw(); // Resume the game by calling the draw function
      }
    }
  });

  // Reset speed button event listener
  document.getElementById("resetSpeed").onclick = () => {
    easyRec.recSpeed = 1;
    showRecSpeed.textContent = easyRec.recSpeed;
  };

  // Plus speed button event listener
  plusSpeed.onclick = () => {
    easyRec.recSpeed += 1;
    showRecSpeed.textContent = easyRec.recSpeed;
  };

  // Minus speed button event listener
  minusSpeed.onclick = () => {
    if (easyRec.recSpeed > 1) {
      easyRec.recSpeed -= 1;
      showRecSpeed.textContent = easyRec.recSpeed;
    }
  };

  // Easy button event listener
  easyBtn.onclick = () => {
    difficulty = "easy";
  };

  // Medium button event listener
  mediumBtn.onclick = () => {
    difficulty = "medium";
  };

  // Hard button event listener
  hardBtn.onclick = () => {
    difficulty = "hard";
  };
  // Draw function
  function draw() {
    showRecSpeed.textContent = recSpeed;
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

    // Drawing Rectangle
    easyRec.drawRec();

    // Rectangle movement
    easyRec.moveRec();

    // Medium mode
    if (difficulty === "medium") {
      context.beginPath();
      context.rect(recx + 100, canvH, recw, -rech2);
      context.fillStyle = "#256D85";
      context.fill();
      context.stroke();
    }

    context.font = "20px courier";
    context.fillStyle = "white";
    context.fillText("FPS: " + fps, 20, 30);
    context.font = "25px courier";
    context.fillStyle = "white";
    context.fillText("Score: " + score, 20, 60);

    // Check if a collision has occurred
    if (easyRec.detectCollision()) {
      // Collision detected
      // Perform actions accordingly
      collision = true;
      stopGame = true;
      score = 0;
    }

    // Check if ball touches the ground
    if (bally > canvH - ballR) {
      score = 0;
      lost = true;
      stopGame = true;
    }

    // Calculate distance between ball and coin
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
      context.strokeText("Paused", 200, 210); // Toggle the pause state when the Space key is pressed
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

  // Reset the game state
  function resetGame() {
    ballx = 200;
    bally = canvH / 2 - ballR;
    stopGame = false;
    collision = false;
    pause = false;
    lost = false;
    gravity = 25;
    score = 0;
    t = Date.now();
    coinx = Math.random() * (canvW - 50);
    coiny = Math.random() * (canvH - 50);
    easyRec.resetRec();
  }

  // Initial text on canvas
  context.font = "90px bangers";
  context.fillStyle = "white";
  context.strokeStyle = "black";
  context.lineWidth = 5;
  context.strokeText("Jumper Game", 90, 200);
  context.fillText("Jumper Game", 90, 200);
  context.lineWidth = 1;

  // Button click event
  startBtn.onclick = function () {
    startBtn.style.display = "none";
    context.clearRect(0, 0, canvas.width, canvas.height);
    resetGame();
    draw();
  };
};
