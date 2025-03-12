const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

const gridSize = 20;
let snake = [{ x: 200, y: 200 }];
let direction = "right";
let nextDirection = "right"; // Nowa zmienna do kontrolowania zmiany kierunku
let food = generateRandomPosition();
let goldFood = null;
let heart = null;
let score = 0;
let lives = 3;
let gameRunning = false;
let gameInterval;
let startTime;
let playerName = localStorage.getItem("currentPlayer");

if (!playerName) {
    window.location.href = "index.html"; 
}

document.getElementById("playerName").innerText = playerName;
document.getElementById("lives").innerText = Życia: ❤❤❤;

function drawSnake() {
    ctx.fillStyle = "#0f0";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
}

function drawFood() {
    ctx.fillStyle = "#f00";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    if (goldFood) {
        ctx.fillStyle = "#FFD700";
        ctx.fillRect(goldFood.x, goldFood.y, gridSize, gridSize);
    }

    if (heart) {
        ctx.fillStyle = "#FF69B4";
        ctx.fillRect(heart.x, heart.y, gridSize, gridSize);
    }
}

function moveSnake() {
    if (!gameRunning) return;

    direction = nextDirection;
    let head = { ...snake[0] };

    switch (direction) {
        case "up": head.y -= gridSize; break;
        case "down": head.y += gridSize; break;
        case "left": head.x -= gridSize; break;
        case "right": head.x += gridSize; break;
    }

    if (head.x < 0) head.x = canvas.width - gridSize;
    if (head.x >= canvas.width) head.x = 0;
    if (head.y < 0) head.y = canvas.height - gridSize;
    if (head.y >= canvas.height) head.y = 0;

    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        lives--;
        document.getElementById("lives").innerText = Życia: ${"❤".repeat(lives)};
        
        if (lives === 0) {
            saveScore();
            stopGame();
            alert("Game Over!");
            return;
        }
        
        snake = [{ x: 200, y: 200 }];
        direction = "right";
        nextDirection = "right";
        return;
    }

    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById("score").innerText = Wynik: ${score};

        if (score % 35 === 0) {
            goldFood = generateRandomPosition();
        }

        if (score % 40 === 0) {
            heart = generateRandomPosition();
        }

        food = generateRandomPosition();
    } else {
        snake.pop();
    }

    if (goldFood && head.x === goldFood.x && head.y === goldFood.y) {
        goldFood = null;
        snake = snake.slice(0, Math.max(1, snake.length - 5));
    }

    if (heart && head.x === heart.x && head.y === heart.y) {
        heart = null;
        lives++;
        document.getElementById("lives").innerText = Życia: ${"❤".repeat(lives)};
    }

    snake.unshift(head);
    drawGame();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    drawSnake();
}

function startGame() {
    if (!gameRunning) {
        score = 0;
        lives = 3;
        document.getElementById("score").innerText = Wynik: ${score};
        document.getElementById("lives").innerText = Życia: ❤❤❤;
        snake = [{ x: 200, y: 200 }];
        direction = "right";
        nextDirection = "right";
        gameRunning = true;
        startTime = Date.now();
        gameInterval = setInterval(moveSnake, 150);
    }
}

function stopGame() {
    gameRunning = false;
    clearInterval(gameInterval);
}

function saveScore() {
    let endTime = Math.floor((Date.now() - startTime) / 1000);
    let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
    scores.push({ name: playerName, score: score, time: endTime });
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem("leaderboard", JSON.stringify(scores));
}

function generateRandomPosition() {
    return {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
    };
}

// *Naprawione sterowanie - działa klawiatura i przyciski*
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && direction !== "down") nextDirection = "up";
    if (e.key === "ArrowDown" && direction !== "up") nextDirection = "down";
    if (e.key === "ArrowLeft" && direction !== "right") nextDirection = "left";
    if (e.key === "ArrowRight" && direction !== "left") nextDirection = "right";
});

document.getElementById("up").addEventListener("click", () => {
    if (direction !== "down") nextDirection = "up";
});
document.getElementById("down").addEventListener("click", () => {
    if (direction !== "up") nextDirection = "down";
});
document.getElementById("left").addEventListener("click", () => {
    if (direction !== "right") nextDirection = "left";
});
document.getElementById("right").addEventListener("click", () => {
    if (direction !== "left") nextDirection = "right";
});

document.getElementById("start").addEventListener("click", startGame);
document.getElementById("stop").addEventListener("click", stopGame);
document.getElementById("menu").addEventListener("click", () => {
    saveScore();
    window.location.href = "index.html";
});

drawGame();