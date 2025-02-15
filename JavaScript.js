let nombrejugador = '';
let gameSequence = [];
let playerSequence = [];
let ronda = 0;
let isPlayerTurn = false;
let ranking = JSON.parse(localStorage.getItem('ranking')) || [];

const startButton = document.getElementById('start-button');
const startScreen = document.getElementById('pantalla-inicio');
const gameScreen = document.getElementById('game-screen');
const rankingScreen = document.getElementById('pantalla-ranking');
const rankingList = document.getElementById('lista-ranking');
const restartButton = document.getElementById('restart-button');
const circles = document.querySelectorAll('.circle');

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', () => {
    rankingScreen.style.display = 'none';
    startScreen.style.display = 'block';
});

circles.forEach(circle => {
    circle.addEventListener('click', () => {
        if (isPlayerTurn) {
            playerSequence.push(circle.id);
            playSound(circle.id);
            if (!checkSequence()) {
                endGame();
            } else if (playerSequence.length === gameSequence.length) {
                nextRound();
            }
        }
    });
});

function startGame() {
    playerName = document.getElementById('nombre-jugador').value;
    if (playerName === '') {
        alert('Por favor, ingresa tu nombre.');
        return;
    }
    startScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    nextRound();
}

function getRandomCircle() {
    const circles = ['red', 'green', 'blue', 'yellow'];
    return circles[Math.floor(Math.random() * circles.length)];
}

