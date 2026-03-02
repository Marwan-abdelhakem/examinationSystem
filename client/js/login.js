// // get ele
// const loginForm = document.getElementById("loginForm");
// const errorDiv = document.querySelector(".error");



// loginForm.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const email = document.getElementById("loginEmail").value.trim();
//   const password = document.getElementById("loginPass").value;

//   errorDiv.style.display = "none";
//   errorDiv.textContent = "";

//   // 
//   if (!email || !password) {
//     showError("Email and password are required");
//     return;
//   }

//   if (password.length < 8) {
//     showError("Password must be at least 8 characters");
//     return;
//   }

//   try {
//     const res = await fetch("http://localhost:3000/api/auth/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ email, password })
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       showError("Invalid email or password");
//       return;
//     }

//     localStorage.setItem("token", data.token);
//     localStorage.setItem("user", JSON.stringify(user));
//     window.location.href = "../client/home.html";

//   } catch {
//     showError("Something went wrong, try again later");
//   }
// });

// function showError(message) {
//   errorDiv.style.display = "block";
//   errorDiv.textContent = message;
// }


const loginForm = document.getElementById("loginForm");
const errorDiv = document.querySelector(".error");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPass").value;

  errorDiv.style.display = "none";

  if (!email || !password) {
    return showError("Email and password are required");
  }

  try {

    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await res.json();

    console.log("LOGIN RESPONSE:", data);

    if (!res.ok) {
      return showError(data.message || "Invalid email or password");
    }

    // ⭐ Save token + user
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    console.log("USER SAVED:", localStorage.getItem("user"));

    // Redirect to home
    window.location.href = "home.html";

  } catch (error) {
    console.error(error);
    showError("Server error. Try again later.");
  }
});

function showError(message) {
  errorDiv.style.display = "block";
  errorDiv.textContent = message;
}