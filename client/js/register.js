const registerForm = document.getElementById("registerForm");
const errorDiv = document.querySelector(".error");

function showError(message, fields = []) {
  const errorDiv = document.querySelector(".error"); // to display error
  errorDiv.textContent = message;
  errorDiv.style.display = "block";  //  

  fields.forEach(field => {
    field.classList.add("input-error");
    field.value = "";
  });
}

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  errorDiv.textContent = "";

  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");

  if (password.value !== confirmPassword.value) {
    showError("Passwords do not match!", [password, confirmPassword]);
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        email: email.value.trim(),
        password: password.value,
        confirmPassword: confirmPassword.value,
        // role: "student",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      showError(data.message, [email]);
      return;
    }

    // alert("Registered successfully!");
    window.location.href = "login.html" //go to home page

    registerForm.reset();

  } catch (err) {
    showError("Server error. Please try again later.");
  }
});
function hideError() {
  const errorDiv = document.querySelector(".error");
  errorDiv.textContent = "";
  errorDiv.style.display = "none";

  const inputs = document.querySelectorAll(".inp");
  inputs.forEach(input => {
    input.classList.remove("input-error");
  });
}
const inputs = document.querySelectorAll(".inp");

inputs.forEach(input => {
  input.addEventListener("input", () => {
    hideError();
  });
});