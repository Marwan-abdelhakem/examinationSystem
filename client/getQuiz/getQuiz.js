let currentQuestions = [];
let currentIndex = 0;
let userAnswers = {};
let flaggedQuestions = new Set();
let timerInterval;
let timeLeft = 0;
let currentExamName = "";

// --- بدء الامتحان ---
async function startExam(quizName) {
  if (!quizName) return alert("Please enter exam name");

  try {
    currentExamName = quizName;
    const response = await fetch(`http://localhost:3000/api/quiz/getQuiz/${quizName.toLowerCase()}`);
    const result = await response.json();

    if (response.ok) {
      // ترتيب عشوائي للأسئلة
      currentQuestions = result.questions.sort(() => Math.random() - 0.5);
      timeLeft = result.quiz.durationInMinutes * 60;

      document.getElementById("displayQuizName").innerText = quizName.toUpperCase();
      document.getElementById("selection-screen").style.display = "none";
      document.getElementById("exam-screen").style.display = "flex";

      runTimer();
      renderQuestion();
    } else {
      alert("Quiz Not Found");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Server connection error");
  }
}

// --- عرض السؤال ---
function renderQuestion() {
  const question = currentQuestions[currentIndex];
  const container = document.getElementById("question-box");
  const isFlagged = flaggedQuestions.has(currentIndex);

  container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 class="question-text">${currentIndex + 1}. ${question.questionText}</h3>
            <button onclick="toggleFlag(${currentIndex})" 
                style="background: ${isFlagged ? '#ffc107' : '#eee'}; border: 1px solid #ccc; padding: 5px 15px; border-radius: 5px; cursor: pointer;">
                ${isFlagged ? 'Flagged' : 'Flag'}
            </button>
        </div>
        <div class="options-container">
            ${question.options.map((option, index) => `
                <label class="option-item" style="display: block; margin: 10px 0; cursor: pointer;">
                    <input type="radio" name="answer" value="${index}" 
                        ${userAnswers[currentIndex] === index ? "checked" : ""} 
                        onchange="recordAnswer(${currentIndex}, ${index})">
                    <span>${option}</span>
                </label>
            `).join("")}
        </div>
    `;

  updateControls();
  renderFlagList();
}

// ---   Flag القائمة الجانبية ---
function toggleFlag(index) {
  if (flaggedQuestions.has(index)) {
    flaggedQuestions.delete(index);
  } else {
    flaggedQuestions.add(index);
  }
  renderQuestion();
}

function renderFlagList() {
  const listContainer = document.getElementById("flag-list");
  if (flaggedQuestions.size === 0) {
    listContainer.innerHTML = "<p style='color: #888; font-size: 14px;'>No flags yet.</p>";
    return;
  }

  listContainer.innerHTML = Array.from(flaggedQuestions)
    .sort((a, b) => a - b)
    .map(qIdx => `
            <button class="flag-item" onclick="goToQuestion(${qIdx})">
                <span>Q ${qIdx + 1}</span>
                <span></span>
            </button>
        `).join("");
}

function goToQuestion(index) {
  currentIndex = index;
  renderQuestion();
}

// --- التحكم والإجابات ---
function recordAnswer(qIndex, aIndex) {
  userAnswers[qIndex] = aIndex;
}

function updateControls() {
  const isLast = currentIndex === currentQuestions.length - 1;
  const isFirst = currentIndex === 0;

  document.getElementById("prev-btn").disabled = isFirst;
  document.getElementById("next-btn").style.display = isLast ? "none" : "inline-block";
  document.getElementById("submit-btn").style.display = isLast ? "inline-block" : "none";

  document.getElementById("counter").innerText = `Question ${currentIndex + 1} of ${currentQuestions.length}`;

  // تحديث شريط التقدم (Progress Bar)
  const progress = ((currentIndex + 1) / currentQuestions.length) * 100;
  document.getElementById("progress-fill").style.width = `${progress}%`;
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

// --- المؤقت وإنهاء الامتحان ---
function runTimer() {
  const timerElement = document.getElementById("timer-display");
  timerInterval = setInterval(() => {
    let mins = Math.floor(timeLeft / 60);
    let secs = timeLeft % 60;
    timerElement.innerText = `${mins}:${secs < 10 ? "0" : ""}${secs}`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      finishExam();
    }
    timeLeft--;
  }, 1000);
}

async function finishExam() {
  clearInterval(timerInterval);
  let score = 0;

  currentQuestions.forEach((q, index) => {
    if (userAnswers[index] === q.correctAnswerIndex) {
      score++;
    }
  });

  try {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:3000/api/quiz/save-result`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        examName: currentExamName,
        score: score,
      }),
    });
  } catch (error) {
    console.error("Error saving result:", error);
  }

  const screen = document.getElementById("exam-screen");
  screen.innerHTML = `
        <div class="result-box" style="text-align: center; width: 100%; padding: 50px;">
            <h2>Exam Completed!</h2>
            <p style="font-size: 24px;">Your Score: <strong>${score} / ${currentQuestions.length}</strong></p>
            <button class="btn-start" onclick="window.location.href='../userHome/home.html'">Go to Home</button>
        </div>
    `;
}