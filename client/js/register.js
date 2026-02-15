const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // تحقق من كلمة المرور قبل الإرسال
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  const role = "student"; // افتراضياً

  try {
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password, role }),
    });

    const data = await res.json();
    console.log(data);
    alert("Registered successfully!");
  } catch (err) {
    console.error(err);
    alert("Error registering user");
  }
});
