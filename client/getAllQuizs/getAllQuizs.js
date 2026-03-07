async function loadQuizzes() {
    const container = document.getElementById("quiz-list-container");
    const token = localStorage.getItem("token");
    try {
        const response = await fetch("http://localhost:3000/api/quiz/getAllQuiz", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();

        if (response.ok) {

            const quizzes = result.data.quizs;

            if (quizzes.length === 0) {
                container.innerHTML = "<p class='empty-msg'>No quizzes available yet.</p>";
                return;
            }

            container.innerHTML = quizzes.map(quiz => `
                <div class="quiz-card">
                    <div class="quiz-icon">📝</div>
                    <h3>${quiz.quizName}</h3>
                    <button class="start-btn" onclick="openQuiz('${quiz.quizName}')">
                        Open Now
                    </button>
                </div>
            `).join('');
        } else {
            container.innerHTML = `<p class="error-msg">${result.message || "Failed to load"}</p>`;
        }
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        container.innerHTML = "<p class='error-msg'>Server Error. Please try again later.</p>";
    }
}

function openQuiz(name) {
    console.log("Starting quiz:", name);
    window.location.href = `../quizDetails/quiz-details.html?name=${encodeURIComponent(name)}`;
}

document.addEventListener("DOMContentLoaded", loadQuizzes);