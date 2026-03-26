// ===== DARK MODE TOGGLE =====
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
}

darkModeToggle.addEventListener('click', function() {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
});

// ===== PAGE NAVIGATION =====
const sections = document.querySelectorAll('section');

function hideAllSections() {
    sections.forEach(section => section.classList.remove('active'));
}

function showPage(pageId) {
    hideAllSections();
    const section = document.getElementById(pageId);
    if (section) {
        section.classList.add('active');
        window.scrollTo(0, 0);
    }
}

// Show Home by default
window.addEventListener('load', () => showPage('home'));

// ===== CAROUSEL FUNCTIONALITY =====
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;
let autoSlideTimer;

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    slides[n].classList.add('active');
    indicators[n].classList.add('active');
}

function changeSlide(direction) {
    currentSlideIndex += direction;
    if (currentSlideIndex >= totalSlides) currentSlideIndex = 0;
    if (currentSlideIndex < 0) currentSlideIndex = totalSlides - 1;
    showSlide(currentSlideIndex);
    resetAutoSlide();
}

function currentSlide(n) {
    currentSlideIndex = n;
    showSlide(currentSlideIndex);
    resetAutoSlide();
}

function autoSlide() {
    currentSlideIndex++;
    if (currentSlideIndex >= totalSlides) currentSlideIndex = 0;
    showSlide(currentSlideIndex);
}

function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(autoSlide, 5000);
}

showSlide(0);
autoSlideTimer = setInterval(autoSlide, 5000);

// ===== MEMORY CARD GAME =====
const gameContainer = document.getElementById('memory-game');
const scoreDisplay = document.getElementById('scoreDisplay');
const startGameBtn = document.getElementById('startGame');
const endGameBtn = document.getElementById('endGame');
const restartBtn = document.getElementById('restartGame');
const levelButtons = document.querySelectorAll('.level-btn');

let cardsArray = [];
let flippedCards = [];
let lockBoard = true;
let score = 0;
let accuracy = 0;
let totalFlips = 0;
let timer;
let countdown;
let gameActive = false;
let selectedLevel = 'easy';

const animals = ['🐶','🐱','🦊','🐻','🐼','🐵','🦁','🐯','🦄','🐸','🐔','🐧','🐴','🐗','🦉','🦝','🐍','🐢','🐙','🦀','🦞','🦑','🦒','🐘','🐳'];

function initGame(level) {
    selectedLevel = level;
    gameContainer.innerHTML = '';
    cardsArray = [];
    flippedCards = [];
    lockBoard = true;
    score = 0;
    totalFlips = 0;
    accuracy = 0;
    gameActive = false;
    scoreDisplay.textContent = `Score: ${score} | Accuracy: ${accuracy}% | Time: 0s`;

    let pairsCount;
    if(level === 'easy') pairsCount = 7;
    else if(level === 'medium') pairsCount = 15;
    else pairsCount = 25;

    const selectedAnimals = animals.slice(0, pairsCount);
    cardsArray = [...selectedAnimals, ...selectedAnimals];
    cardsArray.sort(() => Math.random() - 0.5);

    cardsArray.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.animal = emoji;
        card.textContent = emoji;
        gameContainer.appendChild(card);
    });

    const allCards = document.querySelectorAll('.memory-card');

    setTimeout(() => {
        allCards.forEach(card => card.textContent = '');
        lockBoard = false;
        gameActive = true;
        startTimer(level);
    }, 5000);

    allCards.forEach(card => {
        card.addEventListener('click', () => flipCard(card));
    });

    startGameBtn.disabled = true;
    endGameBtn.disabled = false;
    levelButtons.forEach(btn => btn.disabled = true);
}

function flipCard(card) {
    if(lockBoard || !gameActive) return;
    if(card.classList.contains('flipped')) return;

    card.classList.add('flipped');
    card.textContent = card.dataset.animal;

    flippedCards.push(card);
    totalFlips++;

    if(flippedCards.length === 2) {
        lockBoard = true;
        checkMatch();
    }
}

function checkMatch() {
    const [firstCard, secondCard] = flippedCards;
    if(firstCard.dataset.animal === secondCard.dataset.animal) {
        score++;
        updateScore();
        flippedCards = [];
        lockBoard = false;
        checkWin();
    } else {
        setTimeout(() => {
            if(!gameActive) return;
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.textContent = '';
            secondCard.textContent = '';
            flippedCards = [];
            lockBoard = false;
            updateScore();
        }, 1000);
    }
}

function updateScore() {
    accuracy = totalFlips ? Math.round((score / totalFlips) * 100) : 0;
    scoreDisplay.textContent = `Score: ${score} | Accuracy: ${accuracy}% | Time: ${countdown}s`;
}

function checkWin() {
    const totalPairs = cardsArray.length / 2;
    if(score === totalPairs) {
        clearInterval(timer);
        gameActive = false;
        alert(`🎉 Congratulations! You matched all pairs.\nScore: ${score} | Accuracy: ${accuracy}%`);
        endGame();
    }
}

function startTimer(level) {
    let seconds;
    if(level === 'easy') seconds = 60;
    else if(level === 'medium') seconds = 120;
    else seconds = 180;

    countdown = seconds;
    timer = setInterval(() => {
        countdown--;
        scoreDisplay.textContent = `Score: ${score} | Accuracy: ${accuracy}% | Time: ${countdown}s`;
        if(countdown <= 0) {
            clearInterval(timer);
            lockBoard = true;
            gameActive = false;
            alert(`⏰ Time's up!\nScore: ${score} | Accuracy: ${accuracy}%`);
            endGame();
        }
    }, 1000);
}

startGameBtn.addEventListener('click', () => {
    initGame(selectedLevel);
});

function endGame() {
    clearInterval(timer);
    gameActive = false;
    lockBoard = true;
    startGameBtn.disabled = false;
    endGameBtn.disabled = true;
    levelButtons.forEach(btn => btn.disabled = false);
}

endGameBtn.addEventListener('click', () => {
    if(gameActive) {
        clearInterval(timer);
        gameActive = false;
        lockBoard = true;
        alert(`Game Ended!\nFinal Score: ${score} | Accuracy: ${accuracy}%`);
        endGame();
    }
});

restartBtn.addEventListener('click', () => {
    clearInterval(timer);
    scoreDisplay.textContent = `Score: 0 | Accuracy: 0% | Time: 0s`;
    gameContainer.innerHTML = '';
    lockBoard = true;
    gameActive = false;
    startGameBtn.disabled = false;
    endGameBtn.disabled = true;
    levelButtons.forEach(btn => btn.disabled = false);
});

levelButtons.forEach(button => {
    button.addEventListener('click', () => {
        clearInterval(timer);
        levelButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedLevel = button.dataset.level;
        initGame(selectedLevel);
    });
});

// ===== FEEDBACK FORM VALIDATION =====
const feedbackForm = document.getElementById('feedbackForm');
const feedbackName = document.getElementById('feedbackName');
const feedbackEmail = document.getElementById('feedbackEmail');
const feedbackText = document.getElementById('feedbackText');
const starRating = document.getElementById('starRating');
const stars = document.querySelectorAll('.star');
const ratingDisplay = document.getElementById('ratingDisplay');
const thankYouMessage = document.getElementById('thankYouMessage');

let selectedRating = 0;

function validateName(name) {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return name.trim().length >= 2 && nameRegex.test(name);
}

feedbackName.addEventListener('input', () => {
    const isValid = validateName(feedbackName.value);
    updateFieldStatus(feedbackName, isValid, 'nameError');
});

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

feedbackEmail.addEventListener('input', () => {
    const isValid = validateEmail(feedbackEmail.value);
    updateFieldStatus(feedbackEmail, isValid, 'emailError');
});

function validateFeedback(text) {
    return text.trim().length >= 10;
}

feedbackText.addEventListener('input', () => {
    const isValid = validateFeedback(feedbackText.value);
    updateFieldStatus(feedbackText, isValid, 'feedbackError');
});

stars.forEach(star => {
    star.addEventListener('click', () => {
        selectedRating = parseInt(star.dataset.value);
        updateStarRating();
        clearError('ratingError');
    });

    star.addEventListener('mouseover', () => {
        const hoverValue = parseInt(star.dataset.value);
        stars.forEach((s, index) => {
            if(index < hoverValue) {
                s.style.color = '#f39c12';
            } else {
                s.style.color = '#bdc3c7';
            }
        });
    });
});

starRating.addEventListener('mouseleave', () => {
    updateStarRating();
});

function updateStarRating() {
    stars.forEach((star, index) => {
        if(index < selectedRating) {
            star.classList.add('active');
            star.style.color = '#f39c12';
        } else {
            star.classList.remove('active');
            star.style.color = '#bdc3c7';
        }
    });

    if(selectedRating > 0) {
        ratingDisplay.textContent = `You rated: ${selectedRating}/10 ⭐`;
    } else {
        ratingDisplay.textContent = 'No rating selected';
    }
}

function updateFieldStatus(field, isValid, errorId) {
    const errorElement = document.getElementById(errorId);

    if(field.value.trim() === '') {
        field.classList.remove('valid', 'invalid');
        errorElement.textContent = '';
    } else if(isValid) {
        field.classList.remove('invalid');
        field.classList.add('valid');
        errorElement.textContent = '';
    } else {
        field.classList.remove('valid');
        field.classList.add('invalid');

        if(errorId === 'nameError') {
            errorElement.textContent = '❌ Name must contain only letters and spaces (min 2 characters)';
        } else if(errorId === 'emailError') {
            errorElement.textContent = '❌ Please enter a valid email (e.g., name@example.com)';
        } else if(errorId === 'feedbackError') {
            errorElement.textContent = '❌ Feedback must be at least 10 characters long';
        }
    }
}

function clearError(errorId) {
    document.getElementById(errorId).textContent = '';
}

feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateName(feedbackName.value);
    const isEmailValid = validateEmail(feedbackEmail.value);
    const isFeedbackValid = validateFeedback(feedbackText.value);
    const isRatingValid = selectedRating > 0;

    updateFieldStatus(feedbackName, isNameValid, 'nameError');
    updateFieldStatus(feedbackEmail, isEmailValid, 'emailError');
    updateFieldStatus(feedbackText, isFeedbackValid, 'feedbackError');

    const ratingError = document.getElementById('ratingError');
    if(!isRatingValid) {
        ratingError.textContent = '❌ Please select a rating';
    } else {
        ratingError.textContent = '';
    }

    if(isNameValid && isEmailValid && isFeedbackValid && isRatingValid) {
        feedbackForm.style.display = 'none';
        thankYouMessage.style.display = 'block';

        console.log({
            name: feedbackName.value,
            email: feedbackEmail.value,
            feedback: feedbackText.value,
            rating: selectedRating
        });
    }
});

function resetFeedbackForm() {
    feedbackForm.reset();
    feedbackName.classList.remove('valid', 'invalid');
    feedbackEmail.classList.remove('valid', 'invalid');
    feedbackText.classList.remove('valid', 'invalid');
    selectedRating = 0;
    updateStarRating();
    clearError('nameError');
    clearError('emailError');
    clearError('feedbackError');
    clearError('ratingError');

    feedbackForm.style.display = 'flex';
    thankYouMessage.style.display = 'none';
}