/*const express = require("express");
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
database: "usersdb" // create this DB in MySQL
});
db.connect(err => {
    if (err) throw err;
    console.log("✅ Connected to database");
    });

// Route to handle form submission
app.post("/register", validateRegistration, (req, res) => {
const { username, email, age, program} = req.body;
const sql = "INSERT INTO users (username, email, age, program) VALUES (?, ?, ?, ?)";
db.query(sql, [username, email, age, program], (err, result) => {
        if (err) throw err;
        res.send("🎉 Registration successful!");
        });
    });

// Run server
/*app.listen(3000, () => {
console.log("🚀 Server running on http://localhost:3000");
});*/

//THIS BULLSHIT IS FOR CLICKING THE NEXT BULLSHIT
document.getElementById('start-btn').addEventListener('click', function() {
    document.getElementById('info').style.display = 'none';
    document.getElementById('firstPage').style.display = 'block';
    document.getElementById('next-btn').disabled = false;
});
const timedPages = [
    'fourthPage', 'fifthPage', 'sixthPage', 
    'seventhPage', 'eighthPage', 'ninthPage',
    'thirteenthPage'
];

//TIMER
function startTimedPage(pageId){
    if (!timedPages.includes(pageId))return;

    const page = document.getElementById(pageId);

    const memorize = page.querySelector(".memory, .memorize-view");
    const recall = page.querySelector(".recall, .recall-view");

    setTimeout(() => {

        if (memorize) memorize.style.display = "none";

        if (recall) recall.style.display = "block";

    }, 5000);
}

//BUTTONS WITH TIMER
const nextButtons = document.querySelectorAll('.next-btn');
let currentPageIndex = 0;

const pages = [
    'info', 'firstPage', 'secondPage', 'thirdPage', 'fourthPage', 'fifthPage',
    'sixthPage', 'seventhPage', 'eighthPage', 'ninthPage', 'tenthPage' , 'eleventhPage'
    , 'twelfthPage', 'thirteenthPage'
];

nextButtons.forEach(button => {
    button.addEventListener('click', function(){
        
        const currentPageId = pages[currentPageIndex];
        const currentPage = document.getElementById(currentPageId);

        if (currentPage) currentPage.style.display = 'none';

        currentPageIndex++;

        if (currentPageIndex < pages.length) {
            
            const nextPageId = pages[currentPageIndex];
            const nextPage = document.getElementById(nextPageId);

            nextPage.style.display = 'block';

            startTimedPage(nextPageId);

        } else {
            alert('Test Finished');
            button.disabled = true;
        }
    })
})

//TIMER FOR TIMED PAGES
