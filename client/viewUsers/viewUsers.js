document.addEventListener("DOMContentLoaded", fetchAllUsers);

async function fetchAllUsers() {
    const tbody = document.getElementById("users-list");
    const token = localStorage.getItem("token");

    try {
        const response = await fetch("http://localhost:3000/api/quiz/getAllUsers", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();

        if (response.ok) {
            const users = result.data.users; // تأكد أن المسار يطابق رد الـ API الخاص بك

            if (users.length === 0) {
                tbody.innerHTML = "<tr><td colspan='5'>No users found.</td></tr>";
                return;
            }

            tbody.innerHTML = users.map((user, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${user.firstName || 'N/A'}</td>
                    <td>${user.email}</td>
                    <td><span class="role-badge">${user.role}</span></td>
                </tr>
            `).join('');
        } else {
            alert(result.message || "Failed to fetch users");
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        tbody.innerHTML = "<tr><td colspan='5'>Server error, try again later.</td></tr>";
    }
}