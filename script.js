// Select the HTML elements
const startScreen = document.getElementById("startScreen");
const gameUI = document.querySelector(".container");
let gameContainer = document.querySelector(".game-container");
let scoreContainer = document.querySelector(".score-container");

let gameReady = false;

// Grid and snake setup
let foodX, foodY;           // Position of the food
let headX = 12, headY = 12; // Snake head starting position
let velocityX = 0, velocityY = 0; // Snake direction
let snakeBody = [[12, 12]]; // Snake starts with 1 block
let score = 0;               // Initial score
let game;                    // Reference to setInterval for game loop

// FUNCTION: Generate Food

function generateFood() {
    // Random position in 25x25 grid
    foodX = Math.floor(Math.random() * 25) + 1;
    foodY = Math.floor(Math.random() * 25) + 1;

    // Ensure food is not spawned on the snake head
    if(foodX === headX && foodY === headY) {
        generateFood();
    }
}

// FUNCTION: Game Over

function gameOver() {
    clearInterval(game);          // Stop the game loop
    alert("Game Over!");          // Show alert

    // Reset all variables
    headX = 12;
    headY = 12;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [[12, 12]];
    score = 0;
    scoreContainer.innerHTML = "Score: 0";

    generateFood();               // Place new food
    game = setInterval(renderGame, 150); // Restart game loop
}

// FUNCTION: Render Game (Main Loop)

function renderGame() {
    // Draw the food
    let updateGame = `<div class="food" style="grid-area:${foodY}/${foodX}"></div>`;

    // Update head position based on current velocity
    headX += velocityX;
    headY += velocityY;

    // Check for wall collision
    if(headX === 0 || headX === 26 || headY === 0 || headY === 26) {
        gameOver();
        return;
    }

    // Check if food is eaten
    let ateFood = (headX === foodX && headY === foodY);

    if(ateFood) {
        score += 10;                         // Increase score
        scoreContainer.innerHTML = "Score: " + score;
        generateFood();                       // Place new food
    }

    // Add new head position to the snake body
    snakeBody.unshift([headX, headY]);

    // Remove tail if food not eaten (keep snake same length)
    if(!ateFood) {
        snakeBody.pop();
    }

    // Check self-collision (head with body)
    for(let i = 1; i < snakeBody.length; i++) {
        if(snakeBody[0][0] === snakeBody[i][0] &&
           snakeBody[0][1] === snakeBody[i][1]) {
            gameOver();
            return;
        }
    }

    // Draw the snake body
    for(let i = 0; i < snakeBody.length; i++) {
        updateGame += `<div class="snake" style="grid-area:${snakeBody[i][1]}/${snakeBody[i][0]}"></div>`;
    }

    // Update the HTML
    gameContainer.innerHTML = updateGame;
}

// KEYBOARD INPUT(for direction)

document.addEventListener('keydown', function(e) {
    let key = e.key;

    if(e.key === " " && !gameReady){
        gameReady = true;
        startScreen.style.display = "none";
        gameUI.style.display = "block";
    }

    // Prevent snake from reversing into itself
    if(key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
});

// START THE GAME

generateFood();               // Place first food
game = setInterval(renderGame, 150); // Start the game loop
