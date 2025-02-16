document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-button");
    const restartButton = document.getElementById("restart-button");

    // Cuando el botón "Empezar" es presionado
    startButton.addEventListener("click", (event) => {
        event.preventDefault(); // Evita el comportamiento predeterminado (cargar otra página)
        startGame();
    });

    // Cuando el botón "Reiniciar" es presionado
    restartButton.addEventListener("click", () => {
        restartGame();
        
    });
});

let nombreJugador = "";
let gameSequence = [];
let playerSequence = [];
let ronda = 0;
let isPlayerTurn = false;
let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
const sounds = {
    red:'.audios/562752__ion__b3 (mp3cut.net)',
    green:'.audios/562758__ion__c4 (mp3cut.net)',
    blue:'.audios/562759__ion__f3 (mp3cut.net)',
    yellow:'.audios/608987__smstrahan__g (mp3cut.net)'
}

const startScreen = document.getElementById("pantalla-inicio");
const gameScreen = document.getElementById("game-screen");
const rankingScreen = document.getElementById("pantalla-ranking");
const rankingList = document.getElementById("lista-ranking");
const circles = document.querySelectorAll(".circle");

// Cuando se hace clic en los círculos
circles.forEach(circle => {
    circle.addEventListener("click", () => {
        if (isPlayerTurn) {
            playerSequence.push(circle.id);
            playSound(circle.id);
            if (!checkSequence()) {
                endGame();
            } else if (playerSequence.length === gameSequence.length) {
                nextRound(); // Avanza a la siguiente ronda
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
    localStorage.setItem("nombre-jugador", nombreJugador); // Guarda el nombre
    startScreen.style.display = "none"; // Oculta la pantalla de inicio
    gameScreen.style.display = "block"; // Muestra la pantalla de juego
    nextRound(); // Empieza la primera ronda
}

function getRandomCircle() {
    const circles = ["red", "green", "blue", "yellow"];
    return circles[Math.floor(Math.random() * circles.length)];
}

function checkSequence() {
    // Verifica si la secuencia del jugador es correcta
    for (let i = 0; i < playerSequence.length; i++) {
        if (playerSequence[i] !== gameSequence[i]) {
            return false; // Si hay un error, se retorna falso
        }
    }
    return true; // Si todas las respuestas son correctas, retorna verdadero
}

function nextRound() {
    playerSequence = []; // Limpia la secuencia del jugador
    isPlayerTurn = false; // No se puede jugar hasta que la secuencia de Simon termine
    ronda++; // Incrementa la ronda
    gameSequence.push(getRandomCircle()); // Añade un nuevo color a la secuencia de Simon
    playSequence(); // Reproduce la secuencia de Simon
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
                isPlayerTurn = true; // Permite al jugador interactuar después de que Simon termine su secuencia
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
    ranking.sort((a, b) => b.puntuacion - a.puntuacion); // Ordena los jugadores por puntuación
    localStorage.setItem("ranking", JSON.stringify(ranking)); // Guarda el ranking en localStorage
    showRanking(); // Muestra el ranking
}

function showRanking() {
    rankingScreen.style.display = "block"; // Muestra la pantalla de ranking
    gameScreen.style.display = "none"; // Oculta la pantalla de juego
    rankingList.innerHTML = ""; // Limpia la lista de ranking
    ranking.forEach((jugador, index) => {
        const item = document.createElement("p");
        item.textContent = `${index + 1}. ${jugador.nombre} - ${jugador.puntuacion}`;
        rankingList.appendChild(item);
    });
}

function restartGame(){
    //reinicia el juego
    gameSequence = [];
    playerSequence = [];
    ronda = 0;
    isPLayerTurn = false;

    //reiniciamos la pantalla
    startScreen.style.display = "block";
    rankingScreen.style.display = "none";
    gameScreen.style.display= "none";

    localStorage.removeItem("ranking");//limpiamos el ranking
    localStorage.removeItem("nombre-jugador")//limpiamos nombre del jugador

}


