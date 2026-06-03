// =================== 1. LOGIN & REGISTER (GITHUB PAGES COMPATIBLE) ===================

// Handle Login
const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const message = document.getElementById("message");

        // Fetch registered users from LocalStorage
        const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
        
        // Check if user exists with matching password
        const user = users.find(u => u.email === email && u.password === password);

        if (user || (email === "test@gmail.com" && password === "test1234")) {
            message.style.color = "green";
            message.textContent = "Login successful! Redirecting...";
            localStorage.setItem("userLoggedIn", "true");
            setTimeout(() => { window.location.href = "dashboard.html"; }, 1000);
        } else {
            message.style.color = "red";
            message.textContent = "Invalid credentials. Please register first!";
        }
    });
}

// Handle Registration
const registerForm = document.getElementById("register-form");
if (registerForm) {
    registerForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const message = document.getElementById("message");

        if (!email || !password) {
            message.style.color = "red";
            message.textContent = "Please fill in all fields.";
            return;
        }

        let users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");

        // Check if user already exists
        if (users.some(u => u.email === email)) {
            message.style.color = "red";
            message.textContent = "Account already exists with this email.";
            return;
        }

        // Save new user info locally
        users.push({ email, password });
        localStorage.setItem("registeredUsers", JSON.stringify(users));

        message.style.color = "green";
        message.textContent = "Account created successfully! Redirecting to login...";
        setTimeout(() => { window.location.href = "login.html"; }, 1500);
    });
}

// =================== 2. ALARM REMINDER SYSTEM ===================

const alarmSound = new Audio('alarm.mp3');

document.addEventListener("click", () => {
    alarmSound.play().then(() => {
        alarmSound.pause();
        alarmSound.currentTime = 0;
    }).catch(() => {});
}, { once: true });

document.addEventListener("DOMContentLoaded", () => {
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
    }

    const reminderForm = document.getElementById("reminder-form");
    if (reminderForm) {
        reminderForm.addEventListener("submit", (e) => {
            e.preventDefault();
            addReminder();
        });
    }

    renderReminders();
    setInterval(checkReminder, 60000); 
});

function addReminder() {
    const msgInput = document.getElementById("reminder-message");
    const timeInput = document.getElementById("reminder-time");
    
    if (!msgInput || !timeInput) return;
    const message = msgInput.value.trim();
    const time = timeInput.value;

    if (!message || !time) return alert("Please fill in all fields.");

    const reminder = { message, time, triggered: false };
    const reminders = JSON.parse(localStorage.getItem("reminders") || "[]");
    reminders.push(reminder);
    localStorage.setItem("reminders", JSON.stringify(reminders));

    document.getElementById("reminder-form").reset();
    renderReminders();
    alert("Reminder Set Successfully!");
}

function renderReminders() {
    const list = document.getElementById("reminder-list");
    if (!list) return;
    const reminders = JSON.parse(localStorage.getItem("reminders") || "[]");
    list.innerHTML = "";
    reminders.forEach((r) => {
        const li = document.createElement("li");
        li.textContent = `${new Date(r.time).toLocaleString()} - ${r.message}`;
        if (r.triggered) li.style.color = "gray";
        list.appendChild(li);
    });
}

function checkReminder() {
    let reminders = JSON.parse(localStorage.getItem("reminders") || "[]");
    const now = new Date();
    let updated = false;

    reminders.forEach(reminder => {
        const reminderTime = new Date(reminder.time);
        if (
            now.getMinutes() === reminderTime.getMinutes() &&
            now.getHours() === reminderTime.getHours() &&
            now.getDate() === reminderTime.getDate() &&
            !reminder.triggered
        ) {
            alarmSound.play().catch(() => {});
            alert(`🔔 Reminder: ${reminder.message}`);
            if (Notification.permission === "granted") {
                new Notification("Recycling Reminder!", { body: reminder.message });
            }
            reminder.triggered = true;
            updated = true;
        }
    });

    if (updated) {
        localStorage.setItem("reminders", JSON.stringify(reminders));
        renderReminders();
    }
}