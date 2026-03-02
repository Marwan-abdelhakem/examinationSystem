document.addEventListener("DOMContentLoaded", () => {
  loadUserName();
  loadQuizzes();
  loadPreviousExams();
});

//Show Username
// function loadUserName() {
//   const user = JSON.parse(localStorage.getItem("user"));

//   if (user && user.firstName) {
//     document.getElementById(
//       "username"
//     ).innerText = `Welcome ${user.firstName}`;
//   }
// }

function loadUserName() {
  const user = JSON.parse(localStorage.getItem("user"));
  const usernameElement = document.getElementById("username");

  if (user && usernameElement) {
    usernameElement.innerText = `Welcome ${user.firstName} ${user.lastName}`;
  }
}

// Fetch All Quizzes
async function loadQuizzes() {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:3000/api/quiz/getallquiz", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
      },
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Failed to fetch quizzes");

    const result = await response.json();

    // console.log("Response status:", response.status);
    // console.log("Data:", result);

    renderQuizzes(result.data);
  } catch (error) {
    console.error(error);
  }
}

//  Render Quizzes

function renderQuizzes(quizzes) {
  const grid = document.getElementById("examGrid");

  grid.innerHTML = "";

  if (!quizzes || quizzes.length === 0) {
    grid.innerHTML = "<p>No exams available</p>";
    return;
  }

  quizzes.forEach((quiz) => {
    const card = document.createElement("div");
    card.className = "exam-card";

    card.innerHTML = `
        

        <div class = "exam-title"> ${quiz.quizName}</div>
        <p>Duration: ${quiz.duration || 0} min </p>
        <button class= "start-btn"
         onclick="startExam('${quiz.quizName}')">
         Start Exam
        </button>
    `;

    grid.appendChild(card);
  });
}

// Start Exam Button
async function startExam(quizName) {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:3000/api/quiz/getQuiz/${encodeURIComponent(quizName)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) throw new Error("Faild to start Exam");

    const result = await response.json();
    console.log("Exam Start ", result);
    window.location.href = `../client/getQuiz/getQuiz.html?quiz=${encodeURIComponent(quizName)}`;
  } catch (error) {
    console.error(error);
  }
  console.log("Quiz JS Loaded");
}

// Fetch Previous Exams
async function loadPreviousExams() {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:3000/api/exam/previousexams",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();

    renderPreviousExams(result.data);
  } catch (error) {
    console.error(error);
  }
}

// Render Previous Exams
function renderPreviousExams(exams) {
  const container = document.getElementById("previousExams");

  container.innerHTML = "";

  if (!exams || exams.length === 0) {
    container.innerHTML = "<p>No previous exam results yet</p>";
    return;
  }

  exams.forEach((exam) => {
    container.innerHTML += `
      <div class="prev-item">
        <p>${exam.examName}</p>
        <p>Score: ${exam.score} / ${exam.totalScore}</p>
        <small>${new Date(exam.date).toLocaleDateString()}</small>
      </div>
    `;
  });
}
