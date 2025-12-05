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
    'sixthPage', 'seventhPage', 'eighthPage', 'visual-add', 'ninthPage', 'tenthPage' , 'eleventhPage'
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





//FOR VISUAL MEMO
  const gridSize = 5;   // 5×5 grid
    const flashCount = 5; // how many tiles flash each round

    let flashTiles = [];
    let clickable = false;

    const grid = document.getElementById('grid');
    const message = document.getElementById('message');
    const startBtn = document.getElementById('startBtn');

    function createGrid() {
      grid.innerHTML = '';
      for (let i = 0; i < gridSize * gridSize; i++) {
        const div = document.createElement('div');
        div.classList.add('tile');
        div.dataset.index = i;
        div.addEventListener('click', tileClick);
        grid.appendChild(div);
      }
    }

    let currentRound = 0;
    const maxRounds = 5;

    function startRound() {
    
        if (currentRound >= maxRounds) {
        message.textContent = '🎉 All 5 rounds complete!';
        clickable = false;
        return;
        }

        currentRound++;
        clickable = false;
        flashTiles = [];
        message.textContent = `Round ${currentRound} of ${maxRounds}`

      // pick random tiles
      const total = gridSize * gridSize;
      while (flashTiles.length < flashCount) {
        const r = Math.floor(Math.random() * total);
        if (!flashTiles.includes(r)) {
          flashTiles.push(r);
        }
      }

      // flash them
      flashTiles.forEach(i => {
        const t = grid.querySelector(`.tile[data-index="${i}"]`);
        t.classList.add('flash');
      });

      setTimeout(() => {
        // remove flash, allow clicks
        flashTiles.forEach(i => {
          const t = grid.querySelector(`.tile[data-index="${i}"]`);
          t.classList.remove('flash');
        });
        clickable = true;
        message.textContent = 'Click the tiles you saw flash.';
      }, 1000); // show flash for 1s
    }

    let selected = [];

    function tileClick(e) {
      if (!clickable) return;
      const idx = parseInt(e.target.dataset.index);
      if (e.target.classList.contains('selected')) return;

      e.target.classList.add('selected');
      selected.push(idx);

      if (selected.length === flashTiles.length) {
        clickable = false;
        // check if correct
        const correct = flashTiles.every(i => selected.includes(i));
        if (correct) {
          message.textContent = 'Correct! You passed.';
        } else {
          message.textContent = 'Oopsies!';
        }
        // reset after delay
        setTimeout(() => {
          grid.querySelectorAll('.tile').forEach(t => t.classList.remove('selected'));
          selected = [];
          startRound();
        }, 1500);
      }
    }

    startBtn.addEventListener('click', () => {
      createGrid();
      startRound();
    });

    // initial build
    createGrid();

    