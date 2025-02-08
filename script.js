const gameBoard = document.getElementById('game-board');
const resetButton = document.getElementById('reset');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const congratsMessage = document.getElementById('congrats-message');

// Sample images or emojis for the memory game
const cardData = ['🍎', '🍌', '🍇', '🍓', '🍉', '🍒', '🍋', '🍍', '🍎', '🍌', '🍇', '🍓', '🍉', '🍒', '🍋', '🍍'];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let timer;
let seconds = 0;
let gameStarted = false;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function generateCards() {
    gameBoard.innerHTML = '';  // Clear the board
    const shuffledCards = shuffle(cardData);
    shuffledCards.forEach((item) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = item;

        card.innerHTML = `
            <div class="front">${item}</div>
            <div class="back"></div>
        `;

        // Ensure cards are facedown at the start
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}


function flipCard() {
    if (lockBoard || this === firstCard) return;
    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }

    this.classList.add('flip');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.value === secondCard.dataset.value;

    isMatch ? disableCards() : unflipCards();
    updateMoves();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
    matchedPairs += 1;

    if (matchedPairs === cardData.length / 2) {
        endGame();
    }
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function updateMoves() {
    moves += 1;
    movesDisplay.textContent = moves;
}

function startTimer() {
    timer = setInterval(() => {
        seconds += 1;
        let minutes = Math.floor(seconds / 60);
        let secs = seconds % 60;
        timerDisplay.textContent = `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }, 1000);
}

function resetGame() {
    clearInterval(timer);
    seconds = 0;
    moves = 0;
    matchedPairs = 0;
    gameStarted = false;
    timerDisplay.textContent = '0:00';
    movesDisplay.textContent = '0';
    congratsMessage.classList.add('hidden');
    generateCards();
}

function endGame() {
    clearInterval(timer);
    setTimeout(() => {
        congratsMessage.classList.remove('hidden');
    }, 500);
}

resetButton.addEventListener('click', resetGame);

// Initialize game on page load
generateCards();
