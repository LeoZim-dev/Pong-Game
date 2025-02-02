const canvas = document.getElementById("pongCanvas");
const context = canvas.getContext("2d");

const menu = document.getElementById("menu");
const gameContainer = document.getElementById("game-container");
const scoreBoard = document.getElementById("score-board");
const colorPicker = document.getElementById("color-picker");
const colorInput = document.getElementById("color-input");

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.75;

const paddleHeight = 75;
const paddleWidth = 10;
const ballRadius = 10;

let paddleY1 = (canvas.height - paddleHeight) / 2;
let paddleY2 = (canvas.height - paddleHeight) / 2;
let x = canvas.width / 2;
let y = canvas.height / 2;
let dx = 4 * (Math.random() > 0.5 ? 1 : -1);
let dy = 4 * (Math.random() * 2 - 1);

let upPressed1 = false;
let downPressed1 = false;
let upPressed2 = false;
let downPressed2 = false;

let score1 = 0;
let score2 = 0;
let gameOver = false;
let players = 1;

let paddleColor1 = "#ff0000";
let paddleColor2 = "#0000ff";
let ballColor = "#0095DD";
let borderColor = "#000";
let backgroundColor = "#ffffff"; // Fond blanc

document.addEventListener("touchstart", movePaddle);
document.addEventListener("touchmove", movePaddle);
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function startGame(numPlayers) {
    players = numPlayers;
    menu.style.display = "none";
    colorPicker.style.display = "none";
    gameContainer.style.display = "flex";
    resetBall();
    if (players === 1) {
        drawSinglePlayer();
    } else {
        drawMultiPlayer();
    }
}

function showMenu() {
    gameOver = true;
    setTimeout(() => {
        gameOver = false;
        menu.style.display = "flex";
        colorPicker.style.display = "none";
        gameContainer.style.display = "none";
    }, 100);
}

function showColorPicker() {
    menu.style.display = "none";
    colorPicker.style.display = "flex";
}

function applyColor() {
    backgroundColor = "#ffffff"; // Toujours blanc pour la clarté
    ballColor = colorInput.value;
    showMenu();
}

function backToMenu() {
    showMenu();
}

function keyDownHandler(e) {
    if (players === 1) {
        if (e.key === "Up" || e.key === "ArrowUp") {
            upPressed2 = true;
        } else if (e.key === "Down" || e.key === "ArrowDown") {
            downPressed2 = true;
        }
    } else if (players === 2) {
        if (e.key === "w" || e.key === "W") {
            upPressed1 = true;
        } else if (e.key === "s" || e.key === "S") {
            downPressed1 = true;
        } else if (e.key === "Up" || e.key === "ArrowUp") {
            upPressed2 = true;
        } else if (e.key === "Down" || e.key === "ArrowDown") {
            downPressed2 = true;
        }
    }
}

function keyUpHandler(e) {
    if (players === 1) {
        if (e.key === "Up" || e.key === "ArrowUp") {
            upPressed2 = false;
        } else if (e.key === "Down" || e.key === "ArrowDown") {
            downPressed2 = false;
        }
    } else if (players === 2) {
        if (e.key === "w" || e.key === "W") {
            upPressed1 = false;
        } else if (e.key === "s" || e.key === "S") {
            downPressed1 = false;
        } else if (e.key === "Up" || e.key === "ArrowUp") {
            upPressed2 = false;
        } else if (e.key === "Down" || e.key === "ArrowDown") {
            downPressed2 = false;
        }
    }
}

function movePaddle(e) {
    const touch = e.touches[0];
    const relativeY = touch.clientY - canvas.offsetTop;
    if (relativeY > 0 && relativeY < canvas.height) {
        if (players === 1) {
            paddleY2 = relativeY - paddleHeight / 2;
        } else if (players === 2) {
            if (touch.clientX < canvas.width / 2) {
                paddleY1 = relativeY - paddleHeight / 2;
            } else {
                paddleY2 = relativeY - paddleHeight / 2;
            }
        }
    }
}

function drawPaddle(paddleX, paddleY, color) {
    context.beginPath();
    context.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    context.fillStyle = color;
    context.fill();
    context.closePath();
}

function drawBall() {
    context.beginPath();
    context.arc(x, y, ballRadius, 0, Math.PI * 2);
    context.fillStyle = ballColor;
    context.fill();
    context.closePath();
}

function resetBall() {
    x = canvas.width / 2;
    y = canvas.height / 2;
    dx = 4 * (Math.random() > 0.5 ? 1 : -1);
    dy = 4 * (Math.random() * 2 - 1);
}

function drawBackground() {
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSinglePlayer() {
    drawBackground();
    drawBall();
    drawPaddle(canvas.width - paddleWidth, paddleY2, paddleColor2);
    drawBorder();
    updateScoreBoard();

    if (upPressed2 && paddleY2 > 0) {
        paddleY2 -= 7;
    } else if (downPressed2 && paddleY2 < canvas.height - paddleHeight) {
        paddleY2 += 7;
    }

    if (x + dx < ballRadius) {
        dx = -dx;
    }

    if (x + dx > canvas.width - ballRadius) {
        if (y > paddleY2 && y < paddleY2 + paddleHeight) {
            dx = -dx;
            dx *= 1.25;
            dy *= 1.25;
            score2++;
        } else {
            score1++;
            resetBall();
        }
    }

    if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
        dy = -dy;
    }

    x += dx;
    y += dy;

    if (!gameOver) {
        requestAnimationFrame(drawSinglePlayer);
    }
}

function drawMultiPlayer() {
    drawBackground();
    drawBall();
    drawPaddle(0, paddleY1, paddleColor1);
    drawPaddle(canvas.width - paddleWidth, paddleY2, paddleColor2);
    drawBorder();
    updateScoreBoard();

    if (upPressed1 && paddleY1 > 0) {
        paddleY1 -= 7;
    } else if (downPressed1 && paddleY1 < canvas.height - paddleHeight) {
        paddleY1 += 7;
    }

    if (x + dx < ballRadius) {
        if (y > paddleY1 && y < paddleY1 + paddleHeight) {
            dx = -dx;
            dx *= 1.25;
            dy *= 1.25;
            score1++;
        } else {
            score2++;
            resetBall();
        }
    }

    if (upPressed2 && paddleY2 > 0) {
        paddleY2 -= 7;
    } else if (downPressed2 && paddleY2 < canvas.height - paddleHeight) {
        paddleY2 += 7;
    }

    if (x + dx > canvas.width - ballRadius) {
        if (y > paddleY2 && y < paddleY2 + paddleHeight) {
            dx = -dx;
            dx *= 1.25;
            dy *= 1.25;
            score2++;
        } else {
            score1++;
            resetBall();
        }
    }

    if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
        dy = -dy;
    }

    x += dx;
    y += dy;

    if (!gameOver) {
        requestAnimationFrame(drawMultiPlayer);
    }
}

function drawBorder() {
    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.lineWidth = 5;
    context.strokeStyle = borderColor;
    context.stroke();
    context.closePath();
}

function updateScoreBoard() {
    scoreBoard.innerHTML = `Score: ${score1} | Score: ${score2}`;
}


