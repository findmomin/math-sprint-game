"use strict";
// dom elements
const elements = {
    // Pages
    gamePage: document.getElementById('game-page'),
    scorePage: document.getElementById('score-page'),
    splashPage: document.getElementById('splash-page'),
    countdownPage: document.getElementById('countdown-page'),
    // Splash Page
    startForm: document.getElementById('start-form'),
    radioContainers: [
        ...document.querySelectorAll('.radio-container'),
    ],
    radioInputs: document.querySelectorAll('input'),
    bestScores: document.querySelectorAll('.best-score-value'),
    // Countdown Page
    countdown: document.querySelector('.countdown'),
    // Game Page
    itemContainer: document.querySelector('.item-container'),
    itemFooter: document.querySelector('.item-footer'),
    // Score Page
    finalTimeEl: document.querySelector('.final-time'),
    baseTimeEl: document.querySelector('.base-time'),
    penaltyTimeEl: document.querySelector('.penalty-time'),
    playAgainBtn: document.querySelector('.play-again'),
};
let questions = [];
let answers = [];
let currentQuestion = 0;
let questionsCount;
let timerId;
let passedSeconds = 0;
let nextToEval = 0;
let correctAns = 0;
let wrongAns = 0;
// functions
const shuffleArr = (arr) => {
    let m = arr.length, t, i;
    // While there remain elements to shuffle…
    while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
        // And swap it with the current element.
        t = arr[m];
        arr[m] = arr[i];
        arr[i] = t;
    }
    return arr;
};
// saves the best score to localStorage
const saveBestScore = (score) => {
    // in case it's the first score of the user
    if (!localStorage.getItem(`bestScore${questionsCount}`))
        return localStorage.setItem(`bestScore${questionsCount}`, `${score}`);
    // if there's already is a best score, compare it with the given score
    const savedScore = +localStorage.getItem(`bestScore${questionsCount}`);
    // if the new score is greater than saved one, re-save best score
    if (score < savedScore)
        localStorage.setItem(`bestScore${questionsCount}`, `${score}`);
};
// displays the best score for each play mode
const displayBestScore = () => {
    const playModes = [10, 25, 50, 99];
    playModes.forEach((mode, i) => {
        if (localStorage.getItem(`bestScore${mode}`)) {
            const savedScore = +localStorage.getItem(`bestScore${mode}`);
            elements.bestScores[i].textContent = `${savedScore}s`;
        }
    });
};
const highlightSelection = (e) => {
    const target = e.target;
    if (target.type !== 'radio')
        return;
    elements.radioContainers.forEach(container => container.classList.remove('selected-label'));
    target.parentNode.classList.add('selected-label');
    questionsCount = +target.value;
};
const displayCountdown = (countdown = 3) => {
    return new Promise(resolve => {
        let intervalId;
        let remaingTime = countdown;
        elements.splashPage.setAttribute('hidden', '');
        elements.countdownPage.removeAttribute('hidden');
        elements.countdown.textContent = `${remaingTime}`;
        remaingTime--;
        intervalId = setInterval(() => {
            if (remaingTime < 0) {
                clearInterval(intervalId);
                resolve();
            }
            elements.countdown.textContent = `${remaingTime > 0 ? remaingTime : 'Go!'}`;
            remaingTime--;
        }, 1000);
    });
};
const createRandomQuestions = (amount) => {
    let randomDigit = Math.floor(Math.random() * 10);
    for (let i = 0; i < amount; i++) {
        const firstDigit = randomDigit;
        randomDigit = Math.floor(Math.random() * 10);
        const secondDigit = randomDigit;
        questions.push({ firstDigit, secondDigit });
        answers.push(firstDigit * secondDigit);
    }
};
const displayQuestions = () => {
    // shuffling the answers
    const shuffledAnswers = shuffleArr([...answers]);
    // assigning each shuffeled answer to each of the questions
    shuffledAnswers.forEach((answer, i) => (questions[i].givenAnswer = answer));
    elements.itemContainer.innerHTML = `
    <div class="height-240"></div>
    <div class="selected-item"></div>
  `;
    questions.forEach((question, i) => {
        const { firstDigit, secondDigit } = question;
        const markup = `
      <div class="item"><h1>${firstDigit} x ${secondDigit} = ${shuffledAnswers[i]}</h1></div>
    `;
        elements.itemContainer.insertAdjacentHTML('beforeend', markup);
    });
    elements.itemContainer.insertAdjacentHTML('beforeend', '<div class="height-500"></div>');
    elements.countdownPage.setAttribute('hidden', '');
    elements.gamePage.removeAttribute('hidden');
};
const trackTime = () => (timerId = setInterval(() => (passedSeconds += 0.05), 50));
const evaluateAnswer = (e) => {
    const target = e.target;
    if (!target.classList.contains('right') &&
        !target.classList.contains('wrong'))
        return;
    // scroll to the next question
    elements.itemContainer.scrollTop =
        document.querySelector('.item').offsetHeight *
            (currentQuestion + 1);
    // the evaluation of user answer
    const { firstDigit, secondDigit, givenAnswer } = questions[currentQuestion];
    if (target.classList.contains('right')) {
        firstDigit * secondDigit === givenAnswer ? correctAns++ : wrongAns++;
    }
    else {
        firstDigit * secondDigit !== givenAnswer ? correctAns++ : wrongAns++;
    }
    // update the current question
    currentQuestion++;
    // checking for the last question
    if (currentQuestion === questions.length) {
        // reset the scroll level of the game page
        elements.itemContainer.scrollTop = 0;
        displayResult();
    }
};
const displayResult = () => {
    // stop the timer
    clearInterval(timerId);
    // the final calculated time
    const overallScore = (passedSeconds + wrongAns).toFixed(1);
    elements.finalTimeEl.textContent = `${overallScore}s`;
    elements.baseTimeEl.textContent = `Base Time: ${passedSeconds.toFixed(1)}s`;
    elements.penaltyTimeEl.textContent = `Penalty: +${wrongAns}.0s`;
    elements.gamePage.setAttribute('hidden', '');
    elements.scorePage.removeAttribute('hidden');
    // save the overall score
    saveBestScore(+overallScore);
};
const startRound = async (e) => {
    e.preventDefault();
    if (!questionsCount)
        return;
    await displayCountdown();
    createRandomQuestions(questionsCount);
    displayQuestions();
    trackTime();
};
const playAgain = () => {
    // reset the game
    questions = [];
    answers = [];
    currentQuestion = 0;
    passedSeconds = 0;
    nextToEval = 0;
    correctAns = 0;
    wrongAns = 0;
    // update the best scores
    displayBestScore();
    // display the splash page
    elements.gamePage.setAttribute('hidden', '');
    elements.scorePage.setAttribute('hidden', '');
    elements.countdownPage.setAttribute('hidden', '');
    elements.splashPage.removeAttribute('hidden');
};
displayBestScore();
// event listeners
// highlights the selected play option
elements.startForm.addEventListener('click', highlightSelection);
// start round handler
elements.startForm.addEventListener('submit', startRound);
// evaluates users answer
elements.itemFooter.addEventListener('click', evaluateAnswer);
// play again handler
elements.playAgainBtn.addEventListener('click', playAgain);
