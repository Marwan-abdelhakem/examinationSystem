async function fetchQuizDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const quizName = urlParams.get('name');
    const token = localStorage.getItem("token");

    if (!quizName) {
        alert("Quiz name not found!");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/quiz/getQuiz/${quizName}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();

        if (response.ok) {
            displayQuiz(result.quiz, result.questions);
        } else {
            alert(result.message || "Failed to load quiz");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
function goBack() {
    window.location.href = "../getAllQuizs/getAllQuizs.html";
}

function displayQuiz(quiz, questions) {
    document.getElementById("quiz-title").innerText = quiz.quizName;

    const container = document.getElementById("questions-container");
    container.innerHTML = questions.map((q, index) => `
        <div class="question-card">
            <span class="question-text">Question ${index + 1}: ${q.questionText}</span>
            <div class="options-list">
                ${q.options.map(opt => `
                    <label class="option-item">
                        <input type="radio" name="question_${q._id}" value="${opt}">
                        <span>${opt}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    `).join('');

    container.innerHTML += `
        <div style="text-align: center;">
            <button class="submit-quiz-btn" onclick="goBack()">Back</button>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", fetchQuizDetails);
