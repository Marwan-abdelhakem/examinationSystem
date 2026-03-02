let currentQuestions = [];
let currentIndex = 0;
let userAnswers = {};
let timerInterval;
let timeLeft = 0;


async function startExam(quizName) {
    try {
        const response = await fetch(`http://localhost:3000/api/quiz/getQuiz/${quizName.toLowerCase()}`);
        const result = await response.json();

        if (response.ok) {
            currentQuestions = result.questions;
            timeLeft = result.quiz.durationInMinutes * 60;

            document.getElementById('selection-screen').style.display = 'none';
            document.getElementById('exam-screen').style.display = 'block';

            runTimer();
            renderQuestion();
        } else {
            alert("Quiz not Founded");
        }
    } catch (error) {
        console.error("Error fetching quiz:", error);
        alert("Error");
    }
}


function renderQuestion() {
    const question = currentQuestions[currentIndex];
    const container = document.getElementById('question-box');

    container.innerHTML = `
        <h3 class="question-text">${currentIndex + 1}. ${question.questionText}</h3>
        <div class="options-container">
            ${question.options.map((option, index) => `
                <label class="option-item">
                    <input type="radio" name="answer" value="${index}" 
                        ${userAnswers[currentIndex] === index ? 'checked' : ''} 
                        onchange="recordAnswer(${currentIndex}, ${index})">
                    <span>${option}</span>
                </label>
            `).join('')}
        </div>
    `;

    updateControls();
}



function recordAnswer(qIndex, aIndex) {
    userAnswers[qIndex] = aIndex;
}


function updateControls() {
    const isLast = currentIndex === currentQuestions.length - 1;
    const isFirst = currentIndex === 0;

    document.getElementById('prev-btn').disabled = isFirst;
    document.getElementById('next-btn').style.display = isLast ? 'none' : 'inline-block';
    document.getElementById('submit-btn').style.display = isLast ? 'inline-block' : 'none';

    document.getElementById('counter').innerText = `question ${currentIndex + 1} from ${currentQuestions.length}`;
}

function nextQuestion() {
    if (currentIndex < currentQuestions.length - 1) {
        currentIndex++;
        renderQuestion();
    }
}

function prevQuestion() {
    if (currentIndex > 0) {
        currentIndex--;
        renderQuestion();
    }
}


function runTimer() {
    const timerElement = document.getElementById('timer-display');

    timerInterval = setInterval(() => {
        let mins = Math.floor(timeLeft / 60);
        let secs = timeLeft % 60;

        timerElement.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Time’s up! The exam papers are being collected.");
            finishExam();
        }
        timeLeft--;
    }, 1000);
}


function finishExam() {
    clearInterval(timerInterval);
    let score = 0;

    currentQuestions.forEach((q, index) => {
        if (userAnswers[index] === q.correctAnswerIndex) {
            score++;
        }
    });

    const screen = document.getElementById('exam-screen');
    screen.innerHTML = `
        <div class="result-box">
            <h2>final result</h2>
            <p class="score-text">${score} / ${currentQuestions.length}</p>
            <button onclick="location.reload()">Home </button>
        </div>
    `;
}