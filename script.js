// ===================== GLOBAL DATA ===================== //
let mainPassword = "admin123";
let databases = {
    default: []
};
let currentDatabase = "default";

// Load saved data from localStorage if available
if (localStorage.getItem("adminData")) {
    const saved = JSON.parse(localStorage.getItem("adminData"));
    mainPassword = saved.mainPassword;
    databases = saved.databases;
    currentDatabase = saved.currentDatabase;
}

// ===================== UTILITY FUNCTIONS ===================== //
function saveData() {
    localStorage.setItem("adminData", JSON.stringify({
        mainPassword,
        databases,
        currentDatabase
    }));
}

function generatePassword(length = 8) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function updateUserTable() {
    const tableBody = document.getElementById("user-table-body");
    tableBody.innerHTML = "";

    databases[currentDatabase].forEach((user, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.password}</td>
            <td>
                <button class="action-btn" onclick="editUser(${index})">Edit</button>
                <button class="action-btn" style="background:#e74c3c" onclick="deleteUser(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById("db-name").textContent = currentDatabase;
}

// ===================== LOGIN FUNCTION ===================== //
function login() {
    const inputPass = document.getElementById("admin-password").value;
    if (inputPass === mainPassword) {
        document.getElementById("login-box").style.display = "none";
        document.getElementById("main-dashboard").style.display = "block";
        updateUserTable();
    } else {
        alert("Incorrect Password!");
    }
}

// ===================== ADD USER ===================== //
function addUser() {
    const username = prompt("Enter Username:");
    if (!username) return;

    const password = generatePassword();
    databases[currentDatabase].push({ username, password });
    saveData();
    updateUserTable();
}

// ===================== EDIT USER ===================== //
function editUser(index) {
    const newName = prompt("Enter new username:", databases[currentDatabase][index].username);
    if (!newName) return;
    const newPass = prompt("Enter new password:", databases[currentDatabase][index].password);
    databases[currentDatabase][index] = { username: newName, password: newPass };
    saveData();
    updateUserTable();
}

// ===================== DELETE USER ===================== //
function deleteUser(index) {
    if (confirm("Are you sure you want to delete this user?")) {
        databases[currentDatabase].splice(index, 1);
        saveData();
        updateUserTable();
    }
}

// ===================== SEARCH USER ===================== //
function searchUser() {
    const query = prompt("Enter username to search:");
    if (!query) return;
    const result = databases[currentDatabase].find(u => u.username === query);
    alert(result ? `Found: ${result.username}, Password: ${result.password}` : "User not found!");
}

// ===================== CHANGE MAIN PASSWORD ===================== //
function changePassword() {
    const oldPass = prompt("Enter current main password:");
    if (oldPass !== mainPassword) return alert("Incorrect current password!");
    const newPass = prompt("Enter new password:");
    if (!newPass) return;
    mainPassword = newPass;
    saveData();
    alert("Password changed successfully!");
}

// ===================== ADD/DELETE DATABASE ===================== //
function addDatabase() {
    const dbName = prompt("Enter new database name:");
    if (!dbName || databases[dbName]) return alert("Invalid or duplicate name!");
    databases[dbName] = [];
    saveData();
    alert(`Database "${dbName}" created.`);
}

function deleteDatabase() {
    if (Object.keys(databases).length === 1) return alert("Cannot delete the only database!");
    const dbName = prompt("Enter database name to delete:");
    if (dbName === currentDatabase) return alert("Cannot delete the active database!");
    if (databases[dbName]) {
        delete databases[dbName];
        saveData();
        alert(`Database "${dbName}" deleted.`);
    } else {
        alert("Database not found!");
    }
}

function switchDatabase() {
    const dbName = prompt("Enter database name to switch:");
    if (databases[dbName]) {
        currentDatabase = dbName;
        saveData();
        updateUserTable();
    } else {
        alert("Database not found!");
    }
}

// ===================== EXPORT DATA ===================== //
function exportData() {
    const data = JSON.stringify(databases, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.json";
    link.click();
}

// ===================== CUSTOMIZATION ===================== //
function changeBackground() {
    const color = document.getElementById("bg-color-picker").value;
    document.body.style.backgroundColor = color;
    localStorage.setItem("bgColor", color);
}

if (localStorage.getItem("bgColor")) {
    document.body.style.backgroundColor = localStorage.getItem("bgColor");
}

// ===================== EVENT BINDINGS ===================== //
document.getElementById("login-btn").addEventListener("click", login);
document.getElementById("add-user-btn").addEventListener("click", addUser);
document.getElementById("search-user-btn").addEventListener("click", searchUser);
document.getElementById("change-pass-btn").addEventListener("click", changePassword);
document.getElementById("add-db-btn").addEventListener("click", addDatabase);
document.getElementById("del-db-btn").addEventListener("click", deleteDatabase);
document.getElementById("switch-db-btn").addEventListener("click", switchDatabase);
document.getElementById("export-btn").addEventListener("click", exportData);
document.getElementById("apply-bg-btn").addEventListener("click", changeBackground);
