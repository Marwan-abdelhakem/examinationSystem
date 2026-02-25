// get ele
const loginForm = document.getElementById("loginForm");
const errorDiv = document.querySelector(".error");

// prevent reload form (default behavior of the form)
// loginForm.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   // here it will been read each time
//   const email = document.getElementById("loginEmail").value.trim();
//   const password = document.getElementById("loginPass").value;

//   errorDiv.style.display = "none";
//   errorDiv.textContent = "";

//   if (!email || !password) {
//     errorDiv.style.display = "block";
//     errorDiv.textContent = "All fields are required";
//     return;
//   }

//   try {
//     const res = await fetch("http://localhost:3000/api/auth/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       errorDiv.style.display = "block";
//       errorDiv.textContent = data.message || "Login failed";
//       return;
//     }

//     //
//     localStorage.setItem("token", data.token);

//     window.location.href = "index.html";
//   } catch (err) {
//     errorDiv.style.display = "block";
//     errorDiv.textContent = "Server error. Try again later.";
//   }
// });



loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPass").value;

  errorDiv.style.display = "none";
  errorDiv.textContent = "";

  // ⭐ Frontend Validation
  if (!email || !password) {
    showError("Email and password are required");
    return;
  }

  if (password.length < 8) {
    showError("Password must be at least 8 characters");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      showError("Invalid email or password");
      return;
    }

    localStorage.setItem("token", data.token);
    window.location.href = "index.html";

  } catch {
    showError("Something went wrong, try again later");
  }
});

function showError(message) {
  errorDiv.style.display = "block";
  errorDiv.textContent = message;
}


