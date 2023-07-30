window.onload = () => {
  // Canvas and context
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  const canvW = canvas.width;
  const canvH = canvas.height;

  // Game state
  let lost = false;
  let stopGame = false;
  let pause = false;
  let collision = false;
  let t = Date.now();
  var difficulty = "easy";

  // Rectangle height range
  let min = 100;
  let max = 300;

  // Sound Management classes
  // Background
  class BackgroundMusic {
    constructor(path) {
      this.music = new Audio(path);
    }
    play() {
      this.music.play();
    }
    pause() {
      this.music.pause();
    }
    loop() {
      this.music.loop = true;
    }
    replay() {
      this.music.pause();
      this.music.currentTime = 0;
      this.music.play();
    }
  }

  // Sound effects
  class SoundEffect {
    constructor(path) {
      this.effect = new Audio(path);
      this.mute = false;
      this.effect.volume -= 0.75;
    }
    toggleMute() {
      this.mute = !this.mute;
    }
    play() {
      if (!this.mute) {
        this.effect.play();
      }
    }
  }

  // Ball Class
  class Ball {
    constructor(ballR, ballSpeed, gravity) {
      this.ballR = ballR;
      this.ballSpeed = ballSpeed;
      this.gravity = gravity;
      this.ballx = 200;
      this.bally = canvH / 2 - ballR;
    }

    Fall(x) {
      if (this.bally <= canvH - this.ballR) {
        this.gravity += 50 * x;
        this.bally += this.gravity * x;
      }
    }

    drawBall() {
      context.beginPath();
      context.arc(this.ballx, this.bally, this.ballR, 0, 2 * Math.PI);
      context.fillStyle = "red";
      context.fill();
      context.stroke();
    }

    resetBall() {
      this.ballx = 200;
      this.bally = canvH / 2 - this.ballR;
      this.gravity = 25;
    }
  }

  // Rectangle class
  class Rectangle {
    constructor(recx, rech, recw, recy) {
      this.recx = recx;
      this.rech = rech;
      this.recw = recw;
      this.recy = recy;
      this.temp = this.recx;
      Rectangle.recSpeed = 1;
    }

    moveRec() {
      this.recx -= Rectangle.recSpeed;
      if (this.recx + this.recw <= 0) {
        this.recx = this.temp;
        this.rech = Math.floor(Math.random() * (max - min) + min);
      }
    }

    drawRec(x) {
      context.beginPath();
      context.rect(this.recx, this.recy, this.recw, -this.rech);
      context.fillStyle = x;
      context.fill();
      context.stroke();
    }

    resetRec() {
      this.recx = recx;
      this.rech = rech;
      this.recw = recw;
      this.recy = recy;
    }

    detectCollision() {
      if (
        ball.ballx + ball.ballR >= this.recx &&
        ball.ballx - ball.ballR <= this.recx + this.recw &&
        ball.bally - ball.ballR <= canvH &&
        ball.bally + ball.ballR >= canvH - this.rech
      ) {
        return true;
      } else {
        return false;
      }
    }

    static incrementSpeed() {
      if (Rectangle.recSpeed <= 50) {
        Rectangle.recSpeed += 1;
        document.getElementById("recSpeed").textContent = Rectangle.recSpeed;
      }
    }

    static decrementSpeed() {
      if (difficulty != "hard") {
        if (Rectangle.recSpeed > 1) {
          Rectangle.recSpeed -= 1;
          document.getElementById("recSpeed").textContent = Rectangle.recSpeed;
        }
      } else {
        if (Rectangle.recSpeed > 5) {
          Rectangle.recSpeed -= 1;
          document.getElementById("recSpeed").textContent = Rectangle.recSpeed;
        }
      }
    }

    static ResetSpeed() {
      if (difficulty != "hard") {
        Rectangle.recSpeed = 1;
        document.getElementById("recSpeed").textContent = Rectangle.recSpeed;
      } else {
        Rectangle.recSpeed = 5;
        document.getElementById("recSpeed").textContent = Rectangle.recSpeed;
      }
    }
  }

  // Coin Class
  class Coin {
    constructor(coinr, canvW, canvH) {
      this.coin = new Image();
      this.coin.src = "coin.png";
      this.coinr = coinr;
      this.coinx = Math.random() * (canvW - this.coinr);
      this.coiny = Math.random() * (canvH - this.coinr);
    }

    drawCoin() {
      context.beginPath();
      context.arc(this.coinx, this.coiny, this.coinr, 0, 2 * Math.PI);
      context.fillStyle = "#e3c228";
      context.fill();
      context.drawImage(this.coin, this.coinx - this.coinr, this.coiny - this.coinr, 40, 40);
    }

    Randomize() {
      this.coinx = Math.random() * (canvW - coinr);
      this.coiny = Math.random() * (canvH - coinr);
    }

    Collide(ball) {
      // Calculate distance between ball and coin
      const distance = Math.sqrt(
        Math.pow(ball.ballx - coin.coinx, 2) +
          Math.pow(ball.bally - coin.coiny, 2)
      );

      if (distance < ball.ballR +this.coinr) {
        // Collision detected
        coin.Randomize();
        coinCollect.play();
        return true;
      } else {
        return false;
      }
    }
  }

  // Rectangle Properties
  const recx = canvW;
  const rech = Math.floor(Math.random() * (max - min) + min);
  const recw = 50;
  const recy = canvH;

  // Ball Properties
  const ballR = 30;
  const ballSpeed = 30;
  const gravity = 25;

  // Coin properties
  const coinr = 20;
  const coin = new Coin(coinr, canvW, canvH);

  // Easy Rectangle
  let easyRec = new Rectangle(recx, rech, recw, recy);

  // Medium Rectangle
  let mediumRec = new Rectangle(easyRec.recx + 100, rech, recw, recy);

  // Hard Rectangle
  let hardRec = new Rectangle(mediumRec.recx + 100, rech, recw, recy);

  // Ball object
  const ball = new Ball(ballR, ballSpeed, gravity);

  // Score
  let score = 0;

  // Background music
  const backgroundMusic = new BackgroundMusic("mice-on-venus.mp3");

  // Sound effects
  const coinCollect = new SoundEffect("collect-coin.mp3");
  const lostEffect = new SoundEffect("lose.mp3");

  // Element references
  const startBtn = document.getElementById("Start");
  const resetSpeed = document.getElementById("resetSpeed");
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
        if (ball.ballx > ball.ballR) {
          ball.ballx -= ball.ballSpeed;
        }
      } else if (event.code === "ArrowUp" || event.code === "KeyW") {
        // Up arrow key pressed
        if (ball.bally > ball.ballR) {
          ball.bally -= ball.ballSpeed;
          ball.gravity = 25;
        }
      } else if (event.code === "ArrowRight" || event.code === "KeyD") {
        // Right arrow key pressed
        if (ball.ballx < canvW - ball.ballR) {
          ball.ballx += ball.ballSpeed;
        }
      } else if (
        (event.code === "ArrowLeft" && event.code === "ArrowUp") ||
        (event.code === "KeyA" && event.code === "KeyW")
      ) {
        if (ball.ballx > ball.ballR) {
          ball.ballx -= ball.ballSpeed;
        }
        ball.bally -= ball.ballSpeed;
      } else if (
        (event.code === "ArrowRight" && event.code === "ArrowUp") ||
        (event.code === "KeyD" && event.code === "KeyW")
      ) {
        if (ball.ballx < canvW - ball.ballR) {
          ball.ballx += ball.ballSpeed;
        }
        ball.bally -= ball.ballSpeed;
      } else if (event.code === "ArrowRight" && event.code === "ArrowLeft") {
      } else if (event.code === "ArrowDown" || event.code === "KeyS") {
        if (ball.bally < canvH - ball.ballR) {
          ball.bally += ball.ballSpeed;
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
  resetSpeed.onclick = () => {
    Rectangle.ResetSpeed();
  };

  // Plus speed button event listener
  plusSpeed.onclick = () => {
    Rectangle.incrementSpeed();
  };

  // Minus speed button event listener
  minusSpeed.onclick = () => {
    Rectangle.decrementSpeed();
  };

  // Easy button event listener
  easyBtn.onclick = () => {
    difficulty = "easy";
    easyBtn.style.backgroundColor = "#0a2247";
    mediumBtn.style.backgroundColor = "#2476f1";
    hardBtn.style.backgroundColor = "#2476f1";
  };

  // Medium button event listener
  mediumBtn.onclick = () => {
    difficulty = "medium";
    easyBtn.style.backgroundColor = "#2476f1";
    mediumBtn.style.backgroundColor = "#0a2247";
    hardBtn.style.backgroundColor = "#2476f1";
  };

  // Hard button event listener
  hardBtn.onclick = () => {
    difficulty = "hard";
    Rectangle.recSpeed = 5;
    document.getElementById("recSpeed").textContent = Rectangle.recSpeed;
    easyBtn.style.backgroundColor = "#2476f1";
    mediumBtn.style.backgroundColor = "#2476f1";
    hardBtn.style.backgroundColor = "#0a2247";
  };
  // Draw function
  function draw() {
    const timePassed = (Date.now() - t) / 1000;
    t = Date.now();
    const fps = Math.round(1 / timePassed);
    context.clearRect(0, 0, canvW, canvH);

    // Drawing the ball
    ball.drawBall();
    // Gravity Effect
    ball.Fall(timePassed);

    // Drawing coin
    coin.drawCoin();

    // Drawing Rectangle
    easyRec.drawRec("#256D85");

    // Rectangle movement
    easyRec.moveRec();

    // Medium mode
    mediumRec.drawRec("#856D85");
    if (difficulty === "medium" || difficulty === "hard") {
      mediumRec.moveRec();
    } else {
      mediumRec.resetRec();
    }

    // Hard mode
    hardRec.drawRec("#454D8F");
    if (difficulty === "hard") {
      hardRec.moveRec();
    } else {
      hardRec.resetRec();
    }

    context.font = "20px courier";
    context.fillStyle = "white";
    context.fillText("FPS: " + fps, 20, 30);
    context.font = "25px courier";
    context.fillStyle = "white";
    context.fillText("Score: " + score, 20, 60);

    // Check if a collision has occurred
    if (
      easyRec.detectCollision(ball) ||
      mediumRec.detectCollision(ball) ||
      hardRec.detectCollision(ball)
    ) {
      // Collision detected
      // Perform actions accordingly
      collision = true;
      stopGame = true;
      score = 0;
    }

    // Check if ball touches the ground
    if (ball.bally > canvH - ball.ballR) {
      score = 0;
      lost = true;
      stopGame = true;
    }

    // Calculate distance between ball and coin
    const distance = Math.sqrt(
      Math.pow(ball.ballx - coin.coinx, 2) +
        Math.pow(ball.bally - coin.coiny, 2)
    );

    if (coin.Collide(ball)) {
      // Collision detected
      score++;
     
    }

    if (!stopGame) {
      window.requestAnimationFrame(draw);
    } else if (stopGame && pause) {
      pauseScreen();
    } else if (stopGame && (lost || collision)) {
      lostEffect.play();

      setTimeout(lossScreen,500);
      document.addEventListener("keydown", function (event) {
        if (event.code === "Space" && (collision || lost)) {
          resetGame();
          // Call draw function to restart the game
          window.requestAnimationFrame(draw);
        }
      });
    }
  }

  // Pause Screen
  function pauseScreen() {
    context.fillStyle = "rgba(0, 0, 0, 0.5)"; // Semi-transparent black
    context.fillRect(0, 0, canvW, canvH); // Draw overlay rectangle
    context.font = "90px bangers";
    context.fillStyle = "white";
    context.strokeStyle = "black";
    context.lineWidth = 2.5;
    context.fillText("Paused", 200, 210);
    context.strokeText("Paused", 200, 210); // Toggle the pause state when the Space key is pressed
    context.lineWidth = 1;
  }

  // loss screen
  function lossScreen() {
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
    backgroundMusic.pause();
  }

  // Reset the game state
  function resetGame() {
    stopGame = false;
    collision = false;
    pause = false;
    lost = false;
    score = 0;
    t = Date.now();
    ball.resetBall();
    easyRec.resetRec();
    mediumRec.resetRec();
    hardRec.resetRec();
    Rectangle.ResetSpeed();
    backgroundMusic.replay();
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
    backgroundMusic.play();
    draw();
  };
};
