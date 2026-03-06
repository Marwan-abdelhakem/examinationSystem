const loginForm = document.getElementById("loginForm");
const errorDiv = document.querySelector(".error");

// loginForm.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const email = document.getElementById("loginEmail").value.trim();
//     const password = document.getElementById("loginPass").value;

//     errorDiv.style.display = "none";

//     if (!email || !password) {
//         return showError("Email and password are required");
//     }

//     try {

//         const res = await fetch("http://localhost:3000/api/auth/login", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 email,
//                 password
//             })
//         });

//         const data = await res.json();

//         console.log("LOGIN RESPONSE:", data);

//         if (!res.ok) {
//             return showError(data.message || "Invalid email or password");
//         }

//         //  Save token + user
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user", JSON.stringify(data.user));

//         console.log("USER SAVED:", localStorage.getItem("user"));

//         // Redirect to home
//         window.location.href = "../createQuiz/createQuiz.html";

//     } catch (error) {
//         console.error(error);
//         showError("Server error. Try again later.");
//     }
// });

// function showError(message) {
//     errorDiv.style.display = "block";
//     errorDiv.textContent = message;
// }
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPass").value;

  errorDiv.style.display = "none";

  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await res.json();
    if (!res.ok) {
      const userMessage =
        result.message && !result.stack && res.status !== 500
          ? result.message
          : "Something went wrong, try again later.";

      return showError(userMessage);
    }

    if (res.ok) {
      // التوكن والـ role موجودين جوه result.data
      const { accessToken, role, firstName, lastName } = result.data;

      // حفظ القيم المنفردة (اختياري لو محتاجها)
      localStorage.setItem("token", accessToken);
      localStorage.setItem("role", role);

      //  حفظ كائن المستخدم (التصحيح هنا)
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: email,
          role: role,
          firstName: firstName, // القيمة اللي استخرجناها فوق
          lastName: lastName, // القيمة اللي استخرجناها فوق
          fullName: `${firstName} ${lastName}`, // إضافة الاسم كامل بالمرة للسهولة
        }),
      );
      // التوجيه الصحيح
      window.location.href =
        result.data.role === "admin"
          ? "../homeAdmin/homeAdmin.html"
          : "../userHome/home.html";
      // "F:\ITI\examinationSystem\client\userHome\home.html"
    }
  } catch (error) {
    console.error(error);
    showError("Server error. Try again later.");
  }
});
function showError(message) {
  errorDiv.style.display = "block";
  errorDiv.textContent = message;
}
