document.addEventListener("DOMContentLoaded", () => {
    // 1. استخراج بيانات المستخدم من الـ LocalStorage
    const userData = localStorage.getItem("user");
    const role = localStorage.getItem("role");

    // تأكد إن اللي داخل أدمن فعلاً
    if (!userData || role !== "admin") {
        window.location.href = "../login/login.html";
        return;
    }

    const user = JSON.parse(userData);

    // 2. عرض اسم الأدمن في الـ Navbar
    const welcomeMsg = document.getElementById("welcome-msg");
    // بنستخدم firstName اللي خزناها في الـ Login
    welcomeMsg.innerText = `Welcome, ${user.firstName || 'Admin'}`;
});

// 3. دالة التنقل بين الصفحات (حط الـ paths المظبوطة عندك)
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

// 4. دالة تسجيل الخروج
function logout() {
    localStorage.clear(); // مسح كل البيانات
    window.location.href = "../login/login.html";
}