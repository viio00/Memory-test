const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

// Create Express app 
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const db = mysql.createConnection({
host: "localhost",
user: "root", // change if needed
password: "", // add your MySQL password
database: "itelfinals" // create this DB in MySQL
});

function validateRegistration(req, res, next) {
    const { username, email, age, program } = req.body;
    if (!username || !email || !age || !program) {
        return res.status(400).send("All fields are required!");
    }
    next(); // move to the next middleware if validation passes
}

db.connect(err => {
    if (err) throw err;
    console.log("✅ Connected to database");
    });

// Route to handle form submission
app.post("/register", validateRegistration, (req, res) => {
const { name, email, age, program} = req.body;
const sql = "INSERT INTO users (name, email, age, program) VALUES (?, ?, ?, ?)";
db.query(sql, [name, email, age, program], (err, result) => {
        if (err) throw err;
        res.send("🎉 Registration successful!");
        });
    });

// Run server
app.listen(3000, () => {
console.log("🚀 Server running on http://localhost:3000");
});