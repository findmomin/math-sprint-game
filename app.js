var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _this = this;
// dom elements
var elements = {
    // Pages
    gamePage: document.getElementById('game-page'),
    scorePage: document.getElementById('score-page'),
    splashPage: document.getElementById('splash-page'),
    countdownPage: document.getElementById('countdown-page'),
    // Splash Page
    startForm: document.getElementById('start-form'),
    radioContainers: __spreadArray([], document.querySelectorAll('.radio-container'), true),
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
    playAgainBtn: document.querySelector('.play-again')
};
var questions = [];
var answers = [];
var currentQuestion = 0;
var questionsCount;
var timerId;
var passedSeconds = 0;
var nextToEval = 0;
var correctAns = 0;
var wrongAns = 0;
// functions
var shuffleArr = function (arr) {
    var m = arr.length, t, i;
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
var saveBestScore = function (score) {
    // in case it's the first score of the user
    if (!localStorage.getItem("bestScore" + questionsCount))
        return localStorage.setItem("bestScore" + questionsCount, "" + score);
    // if there's already is a best score, compare it with the given score
    var savedScore = +localStorage.getItem("bestScore" + questionsCount);
    // if the new score is greater than saved one, re-save best score
    if (score < savedScore)
        localStorage.setItem("bestScore" + questionsCount, "" + score);
};
// displays the best score for each play mode
var displayBestScore = function () {
    var playModes = [10, 25, 50, 99];
    playModes.forEach(function (mode, i) {
        if (localStorage.getItem("bestScore" + mode)) {
            var savedScore = +localStorage.getItem("bestScore" + mode);
            elements.bestScores[i].textContent = savedScore + "s";
        }
    });
};
var highlightSelection = function (e) {
    var target = e.target;
    if (target.type !== 'radio')
        return;
    elements.radioContainers.forEach(function (container) {
        return container.classList.remove('selected-label');
    });
    target.parentNode.classList.add('selected-label');
    questionsCount = +target.value;
};
var displayCountdown = function (countdown) {
    if (countdown === void 0) { countdown = 3; }
    return new Promise(function (resolve) {
        var intervalId;
        var remainingTime = countdown;
        elements.splashPage.setAttribute('hidden', '');
        elements.countdownPage.removeAttribute('hidden');
        elements.countdown.textContent = "" + remainingTime;
        remainingTime--;
        intervalId = setInterval(function () {
            if (remainingTime < 0) {
                clearInterval(intervalId);
                resolve();
            }
            elements.countdown.textContent = "" + (remainingTime > 0 ? remainingTime : 'Go!');
            remainingTime--;
        }, 1000);
    });
};
var createRandomQuestions = function (amount) {
    var randomDigit = Math.floor(Math.random() * 10);
    for (var i = 0; i < amount; i++) {
        var firstDigit = randomDigit;
        randomDigit = Math.floor(Math.random() * 10);
        var secondDigit = randomDigit;
        questions.push({ firstDigit: firstDigit, secondDigit: secondDigit });
        answers.push(firstDigit * secondDigit);
    }
};
var displayQuestions = function () {
    // shuffling the answers
    var shuffledAnswers = shuffleArr(__spreadArray([], answers, true));
    // assigning each shuffeled answer to each of the questions
    shuffledAnswers.forEach(function (answer, i) { return (questions[i].givenAnswer = answer); });
    elements.itemContainer.innerHTML = "\n    <div class=\"height-240\"></div>\n    <div class=\"selected-item\"></div>\n  ";
    questions.forEach(function (question, i) {
        var firstDigit = question.firstDigit, secondDigit = question.secondDigit;
        var markup = "\n      <div class=\"item\"><h1>" + firstDigit + " x " + secondDigit + " = " + shuffledAnswers[i] + "</h1></div>\n    ";
        elements.itemContainer.insertAdjacentHTML('beforeend', markup);
    });
    elements.itemContainer.insertAdjacentHTML('beforeend', '<div class="height-500"></div>');
    elements.countdownPage.setAttribute('hidden', '');
    elements.gamePage.removeAttribute('hidden');
};
var trackTime = function () {
    return (timerId = setInterval(function () { return (passedSeconds += 0.05); }, 50));
};
var evaluateAnswer = function (e) {
    var target = e.target;
    if (!target.classList.contains('right') &&
        !target.classList.contains('wrong'))
        return;
    // scroll to the next question
    elements.itemContainer.scrollTop =
        document.querySelector('.item').offsetHeight *
            (currentQuestion + 1);
    // the evaluation of user answer
    var _a = questions[currentQuestion], firstDigit = _a.firstDigit, secondDigit = _a.secondDigit, givenAnswer = _a.givenAnswer;
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
var displayResult = function () {
    // stop the timer
    clearInterval(timerId);
    // the final calculated time
    var overallScore = (passedSeconds + wrongAns).toFixed(1);
    elements.finalTimeEl.textContent = overallScore + "s";
    elements.baseTimeEl.textContent = "Base Time: " + passedSeconds.toFixed(1) + "s";
    elements.penaltyTimeEl.textContent = "Penalty: +" + wrongAns + ".0s";
    elements.gamePage.setAttribute('hidden', '');
    elements.scorePage.removeAttribute('hidden');
    // save the overall score
    saveBestScore(+overallScore);
};
var startRound = function (e) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                e.preventDefault();
                if (!questionsCount)
                    return [2 /*return*/];
                return [4 /*yield*/, displayCountdown()];
            case 1:
                _a.sent();
                createRandomQuestions(questionsCount);
                displayQuestions();
                trackTime();
                return [2 /*return*/];
        }
    });
}); };
var playAgain = function () {
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
