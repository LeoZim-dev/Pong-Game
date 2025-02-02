// Initialisation des variables
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
let paddleY1 = (canvas.height - paddleHeight) / 2; // Position Y du joueur 1
let paddleY2 = (canvas.height - paddleHeight) / 2; // Position Y du joueur 2
let x = canvas.width / 2; // Position X de la balle
let y = canvas.height / 2; // Position Y de la balle
let dx = 4 * (Math.random() > 0.5 ? 1 : -1); // Vitesse X de la balle
let dy = 4 * (Math.random() * 2 - 1); // Vitesse Y de la balle

let upPressed1 = false; // Joueur 1 monte
let downPressed1 = false; // Joueur 1 descend
let upPressed2 = false; // Joueur 2 monte
let downPressed2 = false; // Joueur 2 descend

let score1 = 0; // Score du joueur 1
let score2 = 0; // Score du joueur 2
let gameOver = false; // Indicateur de fin de jeu
let players = 1; // Nombre de joueurs

let paddleColor1 = "#ff0000";  // Rouge pour le joueur 1
let paddleColor2 = "#0000ff";  // Bleu pour le joueur 2
let ballColor = "#0095DD";  // Couleur de la balle
let borderColor = "#000";  // Couleur de la bordure

// Ajout des écouteurs d'événements pour le mode tactile et les touches du clavier
document.addEventListener("touchstart", movePaddle);
document.addEventListener("touchmove", movePaddle);
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function startGame(numPlayers) {
    // Fonction pour démarrer le jeu
    players = numPlayers;
    menu.style.display = "none";
    colorPicker.style.display = "none";
    gameContainer.style.display = "flex";
    resetBall();
    draw();
}

function showMenu() {
    // Fonction pour afficher le menu principal
    gameOver = true;
    setTimeout(() => {
        gameOver = false;
        menu.style.display = "flex";
        colorPicker.style.display = "none";
        gameContainer.style.display = "none";
    }, 100);
}

function showColorPicker() {
    // Fonction pour afficher le sélecteur de couleur
    menu.style.display = "none";
    colorPicker.style.display = "flex";
}

function applyColor() {
    // Fonction pour appliquer la couleur choisie
    const selectedColor = colorInput.value;
    ballColor = selectedColor;
    showMenu();
}

function backToMenu() {
    // Fonction pour revenir au menu principal
    showMenu();
}

function keyDownHandler(e) {
    // Gestion des touches enfoncées
    if (players === 1) {
        if (e.key === "Up" || e.key === "ArrowUp") {
            upPressed2 = true;
        } else if (e.key === "Down" || e.key === "ArrowDown") {
            downPressed2 = true;
        }
    } else {
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
    // Gestion des touches relâchées
    if (players === 1) {
        if (e.key === "Up" || e.key === "ArrowUp") {
            upPressed2 = false;
        } else if (e.key === "Down" || e.key === "ArrowDown") {
            downPressed2 = false;
        }
    } else {
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
    // Fonction pour déplacer les raquettes en fonction du toucher
    const touch = e.touches[0];
    const relativeY = touch.clientY - canvas.offsetTop;
    if (relativeY > 0 && relativeY < canvas.height) {
        if (players === 1) {
            paddleY2 = relativeY - paddleHeight / 2;
        } else {
            if (touch.clientX < canvas.width / 2) {
                paddleY1 = relativeY - paddleHeight / 2;
            } else {
                paddleY2 = relativeY - paddleHeight / 2;
            }
        }
    }
}

function drawPaddle(paddleX, paddleY, color) {
    // Fonction pour dessiner une raquette
    context.beginPath();
    context.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    context.fillStyle = color;
    context.fill();
    context.closePath();
}

function drawBall() {
    // Fonction pour dessiner la balle
    context.beginPath();
    context.arc(x, y, ballRadius, 0, Math.PI * 2);
    context.fillStyle = ballColor;
    context.fill();
    context.closePath();
}

function resetBall() {
    // Fonction pour réinitialiser la position de la balle
    x = canvas.width / 2;
    y = canvas.height / 2;
    dx = 4 * (Math.random() > 0.5 ? 1 : -1);
    dy = 4 * (Math.random() * 2 - 1);
}

function draw() {
    // Fonction pour dessiner l'écran de jeu
    context.clearRect(0, 0, canvas.width, canvas.height);
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

    if (upPressed2 && paddleY2 > 0) {
        paddleY2 -= 7;
    } else if (downPressed2 && paddleY2 < canvas.height - paddleHeight) {
        paddleY2 += 7;
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
        requestAnimationFrame(draw);
    }
}

function drawBorder() {
    // Fonction pour dessiner la bordure du terrain
    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.lineWidth = 5;
    context.strokeStyle = borderColor;
    context.stroke();
    context.closePath();
}

function updateScoreBoard() {
    // Fonction pour mettre à jour le tableau des scores
    scoreBoard.innerHTML = `Score: ${score1} | Best Score: ${score2}`;
}

resetBall();
draw();


