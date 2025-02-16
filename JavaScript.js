document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-button");
    const restartButton = document.getElementById("restart-button");
    const showRankingButton = document.createElement("button");

    showRankingButton.id = "show-ranking";
    showRankingButton.textContent = "Ver Ranking";
    showRankingButton.classList.add("boton-empezar");
    document.getElementById("pantalla-inicio").appendChild(showRankingButton);

    // Iniciar juego
    startButton.addEventListener("click", (event) => {
        event.preventDefault();
        startGame();
    });

    // Reiniciar juego
    restartButton.addEventListener("click", () => {
        restartGame();
    });

    // Mostrar ranking desde el inicio
    showRankingButton.addEventListener("click", () => {
        showRanking();
    });
});

let nombreJugador = "";
let gameSequence = [];
let playerSequence = [];
let ronda = 0;
let isPlayerTurn = false;
let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

const sounds = {
    red: "./audios/562752__ion__b3 (mp3cut.net).mp3",
    green: "./audios/562758__ion__c4 (mp3cut.net).mp3",
    blue: "./audios/562759__ion__f3 (mp3cut.net).mp3",
    yellow: "./audios/608987__smstrahan__g (mp3cut.net).mp3"
};

const startScreen = document.getElementById("pantalla-inicio");
const gameScreen = document.getElementById("game-screen");
const rankingScreen = document.getElementById("pantalla-ranking");
const rankingList = document.getElementById("lista-ranking");
const circles = document.querySelectorAll(".circle");

// Manejo de clic en los círculos
circles.forEach(circle => {
    circle.addEventListener("click", () => {
        if (isPlayerTurn) {
            playerSequence.push(circle.id);
            playSound(circle.id);
            if (!checkSequence()) {
                setTimeout(() => {
                    endGame();
                }, 500);
            } else if (playerSequence.length === gameSequence.length) {
                setTimeout(() => {
                    nextRound();
                }, 800);
            }
        }
    });
});

function startGame() {
    nombreJugador = document.getElementById("nombre-jugador").value.trim();
    if (!nombreJugador) {
        alert("Por favor, ingresa tu nombre.");
        return;
    }
    localStorage.setItem("nombre-jugador", nombreJugador);
    startScreen.style.display = "none";
    gameScreen.style.display = "block";
    ronda = 0;
    gameSequence = [];
    nextRound();
}

function getRandomCircle() {
    const circles = ["red", "green", "blue", "yellow"];
    return circles[Math.floor(Math.random() * circles.length)];
}

function checkSequence() {
    for (let i = 0; i < playerSequence.length; i++) {
        if (playerSequence[i] !== gameSequence[i]) {
            return false;
        }
    }
    return true;
}

function nextRound() {
    playerSequence = [];
    isPlayerTurn = false;
    ronda++;
    gameSequence.push(getRandomCircle());
    playSequence();
}

function playSequence() {
    let i = 0;
    const interval = setInterval(() => {
        playSound(gameSequence[i]);
        highlightCircle(gameSequence[i]);
        i++;
        if (i >= gameSequence.length) {
            clearInterval(interval);
            setTimeout(() => {
                isPlayerTurn = true;
            }, 500);
        }
    }, 1000);
}

function playSound(color) {
    let audio = new Audio(sounds[color]);
    audio.play();
}

function highlightCircle(color) {
    const circle = document.getElementById(color);
    if (circle) {
        circle.style.opacity = "0.5";
        setTimeout(() => {
            circle.style.opacity = "1";
        }, 500);
    }
}

function endGame() {
    alert(`Juego terminado. Llegaste a la ronda ${ronda}.`);
    ranking.push({ nombre: nombreJugador, puntuacion: ronda });
    ranking.sort((a, b) => b.puntuacion - a.puntuacion);
    localStorage.setItem("ranking", JSON.stringify(ranking));
    showRanking();
}

function showRanking() {
    rankingScreen.style.display = "block";
    gameScreen.style.display = "none";
    startScreen.style.display = "none";
    rankingList.innerHTML = "";
    ranking.forEach((jugador, index) => {
        const item = document.createElement("p");
        item.textContent = `${index + 1}. ${jugador.nombre} - ${jugador.puntuacion}`;
        rankingList.appendChild(item);
    });
}

function restartGame() {
    gameSequence = [];
    playerSequence = [];
    ronda = 0;
    isPlayerTurn = false;

    startScreen.style.display = "block";
    rankingScreen.style.display = "none";
    gameScreen.style.display = "none";

    localStorage.removeItem("ranking");
    localStorage.removeItem("nombre-jugador");
}




