let mainPassword = localStorage.getItem("mainPassword") || "12345";
let isAdmin = false;
let databases = JSON.parse(localStorage.getItem("databases")) || { "Default": [] };
let currentDB = localStorage.getItem("currentDB") || "Default";

function login() {
    let password = document.getElementById("login-password").value;
    if (password === mainPassword) {
        isAdmin = true;
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("main-app").style.display = "block";
        document.getElementById("admin-panel").style.display = "block";
        loadDatabases();
        displayStudents();
    } else if (password === "user") {
        isAdmin = false;
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("main-app").style.display = "block";
        document.getElementById("admin-panel").style.display = "none";
        displayStudents();
    } else {
        alert("Incorrect Password!");
    }
}

function logout() {
    document.getElementById("login-screen").style.display = "block";
    document.getElementById("main-app").style.display = "none";
}

function changeMainPassword() {
    if (!isAdmin) return alert("Admin only!");
    let newPass = document.getElementById("new-password").value;
    if (newPass.trim() !== "") {
        mainPassword = newPass;
        localStorage.setItem("mainPassword", newPass);
        alert("Password changed successfully!");
    }
}

function loadDatabases() {
    let select = document.getElementById("database-select");
    select.innerHTML = "";
    for (let db in databases) {
        let option = document.createElement("option");
        option.value = db;
        option.textContent = db;
        if (db === currentDB) option.selected = true;
        select.appendChild(option);
    }
}

function createDatabase() {
    let dbName = document.getElementById("new-db").value.trim();
    if (dbName === "" || databases[dbName]) {
        alert("Invalid or existing database name!");
        return;
    }
    databases[dbName] = [];
    currentDB = dbName;
    saveDatabases();
    loadDatabases();
    displayStudents();
}

function switchDatabase() {
    currentDB = document.getElementById("database-select").value;
    localStorage.setItem("currentDB", currentDB);
    displayStudents();
}

function deleteDatabase() {
    if (currentDB === "Default") {
        alert("Cannot delete default database!");
        return;
    }
    delete databases[currentDB];
    currentDB = "Default";
    saveDatabases();
    loadDatabases();
    displayStudents();
}

function addStudent() {
    let name = document.getElementById("name").value;
    let admission = document.getElementById("admission").value;
    let mobile = document.getElementById("mobile").value;
    let className = document.getElementById("class").value;
    let email = document.getElementById("email").value;
    let photoFile = document.getElementById("photo").files[0];

    if (!name || !admission || !mobile) {
        alert("Please fill all required fields!");
        return;
    }

    let reader = new FileReader();
    reader.onload = function() {
        let photoData = reader.result || "";
        let student = { name, admission, mobile, className, email, photo: photoData };
        databases[currentDB].push(student);
        saveDatabases();
        displayStudents();
        clearFields();
    };
    if (photoFile) {
        reader.readAsDataURL(photoFile);
    } else {
        reader.onload();
    }
}

function displayStudents() {
    let list = document.getElementById("student-list");
    list.innerHTML = "";
    let students = databases[currentDB];
    students.forEach((student, index) => {
        let div = document.createElement("div");
        div.className = "student-card";
        div.innerHTML = `
            <img src="${student.photo || 'https://via.placeholder.com/50'}" alt="Photo">
            <div>
                <p><strong>${student.name}</strong></p>
                <p>Mobile: ${student.mobile}</p>
                <p>Class: ${student.className}</p>
            </div>
            <div>
                ${isAdmin ? `<button onclick="editStudent(${index})">Edit</button>
                             <button onclick="deleteStudent(${index})">Delete</button>` : ""}
            </div>
        `;
        list.appendChild(div);
    });
}

function editStudent(index) {
    if (!isAdmin) return;
    let student = databases[currentDB][index];
    document.getElementById("name").value = student.name;
    document.getElementById("admission").value = student.admission;
    document.getElementById("mobile").value = student.mobile;
    document.getElementById("class").value = student.className;
    document.getElementById("email").value = student.email;
    deleteStudent(index);
}

function deleteStudent(index) {
    if (!isAdmin) return;
    databases[currentDB].splice(index, 1);
    saveDatabases();
    displayStudents();
}

function clearFields() {
    document.getElementById("name").value = "";
    document.getElementById("admission").value = "";
    document.getElementById("mobile").value = "";
    document.getElementById("class").value = "";
    document.getElementById("email").value = "";
    document.getElementById("photo").value = "";
}

function searchStudent() {
    let query = document.getElementById("search").value.toLowerCase();
    let students = databases[currentDB].filter(s => s.name.toLowerCase().includes(query) || s.mobile.includes(query));
    let list = document.getElementById("student-list");
    list.innerHTML = "";
    students.forEach((student, index) => {
        let div = document.createElement("div");
        div.className = "student-card";
        div.innerHTML = `
            <img src="${student.photo || 'https://via.placeholder.com/50'}" alt="Photo">
            <div>
                <p><strong>${student.name}</strong></p>
                <p>Mobile: ${student.mobile}</p>
                <p>Class: ${student.className}</p>
            </div>
        `;
        list.appendChild(div);
    });
}

function clearAllData() {
    if (!isAdmin) return alert("Admin only!");
    if (confirm("Delete all data in current database?")) {
        databases[currentDB] = [];
        saveDatabases();
        displayStudents();
    }
}

function exportData() {
    let data = databases[currentDB];
    let blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = `${currentDB}.json`;
    a.click();
}

function changeBackground() {
    document.body.style.background = document.getElementById("bg-color").value;
}

function saveDatabases() {
    localStorage.setItem("databases", JSON.stringify(databases));
    localStorage.setItem("currentDB", currentDB);
}
