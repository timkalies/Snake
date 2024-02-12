let tileSize,
  nrOfTilesInX,
  nrOfTilesInY,
  canvas,
  ctx,
  snakeColor,
  snakeX,
  snakeY,
  foodColor,
  foodX,
  foodY,
  foodN,
  snakeDirection,
  score,
  gameLoopInterval,
  highscore,
  displayScore;

const Direction = {};
//Variablen außerhalb deklariert für global scope

/*********************************************************/

document.addEventListener("DOMContentLoaded", function () {
  highscore = 0;
  displayScore = document.getElementById("highscore");
  displayScore.innerHTML = "HIGHSCORE: " + highscore;
  /*********
   * GAME - Variablen
   *********/
  tileSize = 15;
  nrOfTilesInX = 50;
  nrOfTilesInY = 30;

  score = 0;

  snakeColor = "red"; //Setzt Snake Farbe
  snakeX = 2;
  snakeY = 2;
  //setzt Snake Position

  foodColor = "green"; //Setzt Apfel Farbe
  foodX = getRandomNumber(0, nrOfTilesInX - 1);
  foodY = getRandomNumber(0, nrOfTilesInY - 1);
  //setzt züfällige Apfel Position innerhalb des Spielfelds

  Object.assign(Direction, {
    //setzt steuerungsmarker
    UP: 1,
    RIGHT: 2,
    DOWN: 3,
    LEFT: 4,
  });

  snakeDirection = Direction.RIGHT;
  //Setzt grundlegende Richtung, lässt sich durch steuerung ändern

  /*********
   * Canvas - Variablen
   *********/
  canvas = document.getElementById("playfield");
  ctx = canvas.getContext("2d");
  /*Berechnet Canvas Größe*/
  ctx.canvas.width = nrOfTilesInX * tileSize;
  ctx.canvas.height = nrOfTilesInY * tileSize;
});

/*********************************************************/
/* Zeichnet Snake auf Canvas*/
function fillTile(x, y, color) {
  ctx.beginPath(); /*Setzt Startpunkt für Tile*/
  ctx.rect(
    x * tileSize /*Setzt x-koordinate der Schlange*/,
    y * tileSize /*Setzt y-koordinate der Schlange*/,
    tileSize /*Setzt Weite der Schlange*/,
    tileSize
  ); /*Setzt Höhe der Schlange*/
  ctx.fillStyle = color; /*Setzt Farbe der Schlange*/
  ctx.fill(); /*Füllt Tile mit gewählter Farbe*/
  ctx.closePath(); /*Füllt restliche linien*/
}

/*********************************************************/

function drawText(text, font, color, x, y) {
  //Zeichnet Score auf Canvasd
  ctx.beginPath();
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.closePath();
}

/*********************************************************/
function checkFoodCollision() {
  if (snakeX == foodX && snakeY == foodY) {
    score = score + 1; //Gibt einen Punkt
    generateNewFood();
    //Wird ausgeführt wenn koordinate von apfel und schlange gleich
  }
}

function generateNewFood() {
  foodN = getRandomNumber(1, 4);
  foodX = getRandomNumber(0, nrOfTilesInX - 1);
  foodY = getRandomNumber(0, nrOfTilesInY - 1);
  // Zeichnet den Apfel an einer zufälligen Position
}
/*********************************************************/

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/*********************************************************/

function moveSnake() {
  //Bestimmt Richtungssinn bei spezifischer Eingabe
  if (snakeDirection == Direction.UP) {
    snakeY = snakeY - 1;
  } else if (snakeDirection == Direction.RIGHT) {
    snakeX = snakeX + 1;
  } else if (snakeDirection == Direction.DOWN) {
    snakeY = snakeY + 1;
  } else if (snakeDirection == Direction.LEFT) {
    snakeX = snakeX - 1;
  }
}

/*********************************************************/

function keyPressed(event) {
  if (event.key == "ArrowUp") {
    snakeDirection = Direction.UP;
  } else if (event.key == "ArrowRight") {
    snakeDirection = Direction.RIGHT;
  } else if (event.key == "ArrowDown") {
    snakeDirection = Direction.DOWN;
  } else if (event.key == "ArrowLeft") {
    snakeDirection = Direction.LEFT;
  }
}
document.addEventListener("keydown", keyPressed);
//Website registriert jede Tastenaktion und führt dann steuerung aus
/*********************************************************/

//Erzeugt zufällige Koordinate innerhalb des Canvas für Apfel
function getRandomNumber(start, end) {
  return Math.floor(Math.random() * (end - start + 1) + start); //Start-End begrenzt Feld
}

/*********************************************************/

function gameOver() {
  //Beendet Loops bei Ausführung
  drawText(
    "Game over!",
    "60px Arial black",
    "black",
    canvas.width / 2 - 200,
    canvas.height / 2
  );
  if (score >= highscore) {
    highscore = score;
    displayScore.innerHTML = "Highscore: " + highscore;
  }
  clearInterval(gameLoopInterval);
}

function checkWallCollision() {
  //Wenn Schlange Wand in x-oder-y richtung berührt spielende
  if (snakeX < 0 || snakeX > nrOfTilesInX) {
    gameOver();
  }

  if (snakeY < 0 || snakeY > nrOfTilesInY) {
    gameOver();
  }
}

/*********************************************************/

//Lädt Canvas regelmäßig neu um "fillTile" darzustellen
function gameLoop() {
  //Entfernt zuvor gefüllte Tiles
  clearCanvas();
  //Bestimmt die X-Y Koordinate bei Bewegungsrichtung
  moveSnake();
  //Checkt regelmäßig koordinaten von Apfel und Snake
  checkFoodCollision();
  //Checkt ob Schlange mit Wand kollidiert
  checkWallCollision();
  //Zeichnet den Spieler/Snake
  fillTile(snakeX, snakeY, snakeColor);
  // zeichnet den Apfel
  fillTile(foodX, foodY, foodColor);
  //Zeichnet score
  drawText("Score: " + score, "20px Arial", "black", 10, canvas.height - 10);
}
// Called die Funktion und lädt sie alle 0.1sec neu

function start() {
  gameLoopInterval = setInterval(gameLoop, 100);
}
function restart() {
  fillTile(canvas.width / 2 - 200, canvas.height / 2, "lightgrey");
  clearCanvas();
  //Bestimmt die X-Y Koordinate bei Bewegungsrichtung
  score = 0;
  snakeX = 2;
  snakeY = 2; //Setzt Koords und Score auf Anfang
  fillTile(snakeX, snakeY, snakeColor);
  fillTile(foodX, foodY, foodColor);
  drawText("Score: " + score, "20px Arial", "black", 10, canvas.height - 10);
  // Vor dem Starten eines neuen Intervalls das vorherige löschen
  clearInterval(gameLoopInterval);
  gameLoopInterval = setInterval(gameLoop, 100);
}
