document.addEventListener("DOMContentLoaded", () => {
    const userData = localStorage.getItem("user");
    const role = localStorage.getItem("role");

    if (!userData || role !== "admin") {
        window.location.href = "../login/login.html";
        return;
    }

    const user = JSON.parse(userData);

    const welcomeMsg = document.getElementById("welcome-msg");
    welcomeMsg.innerText = `Welcome, ${user.firstName || 'Admin'}`;
});

function navigateTo(page) {
    const routes = {
        'create-quiz': '../createQuiz/createQuiz.html',
        'view-quizzes': '../getAllQuizs/getAllQuizs.html',
        'view-users': '../viewUsers/viewUsers.html'
    };

    if (routes[page]) {
        window.location.href = routes[page];
    }
}

function logout() {
    localStorage.clear(); // مسح كل البيانات
    window.location.href = "../login/login.html";
}