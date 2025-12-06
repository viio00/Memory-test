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
app.listen(3000, () => {
console.log("🚀 Server running on http://localhost:3000");
});

//THIS BULLSHIT IS FOR CLICKING THE NEXT BULLSHIT
document.getElementById('start-btn').addEventListener('click', function() {
    document.getElementById('info').style.display = 'none';
    document.getElementById('firstPage').style.display = 'block';
    document.getElementById('next-btn').disabled = false;
});
const timedPages = [
    'fourthPage', 'fifthPage', 'sixthPage', 
    'seventhPage', 'eighthPage', 'ninthPage', 'tenthPage',
    'thirteenthPage'
];

///////////////////////////////////TIMER////////////////////////////////////////////////
function startTimedPage(pageId){
    console.log("Starting Timer for:", pageId);
    if (!timedPages.includes(pageId)) return;

    const page = document.getElementById(pageId);
    const memorize = page.querySelector(".memorize, .memorize-view");
    const recall = page.querySelector(".recall, .recall-view");

    if (!memorize || !recall) return;

    memorize.style.display = 'block';
    recall.style.display = 'none';

    let timeLeft = 5;

    const timer = document.getElementById("timer");
    timer.style.display = "block";
    timer.textContent = timeLeft;

    console.log("Timer Started, timeleft: "+ timeLeft);

    const countdown = setInterval(() => {
        timeLeft--;
        timer.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(countdown)
            timer.style.display = "none";

            if (memorize) memorize.style.display = "none";

            if (recall) recall.style.display = "block";
        }
    }, 1000);
}

//BUTTONS WITH TIMER
const nextButtons = document.querySelectorAll('.next-btn');
let currentPageIndex = 1;
let totatPoints = 0;

const pages = [
    'info', 

    'firstPage', 
    'secondPage', 

    'thirdPage',

    'fourthPage',
    'fifthPage',
    'sixthPage', 
    'seventhPage', 
    'eighthPage',

    'visual-add',

    'ninthPage', 
    'tenthPage', 
    'eleventhPage', 
    'twelfthPage', 
    'thirteenthPage',

    "btn"
];

// Points mapping function for each question
function getPointsForAnswer(name, value) {
    const pointsMap = {
        // Cognitive Ability Survey
        '1st': { // How easily do you lose focus during tasks?
            'a': 1, // Never
            'b': 2, // Rarely
            'c': 3, // Sometimes
            'd': 4, // Often
            'e': 5  // Always
        },
        '2nd': { // How confident are you in making quick decisions?
            'a': 1, // Not Confident
            'b': 2, // Slightly Confident
            'c': 3, // Moderately Confident
            'd': 4, // Confident
            'e': 5  // Very Confident
        },
        '3rd': { // How often do you feel stuck when solving problems?
            'a': 1, // 0-1 days
            'b': 2, // 2-3 days
            'c': 3, // 4-5 days
            'd': 4, // 1 week
            'e': 5  // More than a week
        },
        '4th': { // Is it easy to connect new information to what you know?
            'a': 1, // Very Difficult
            'b': 2, // Difficult
            'c': 3, // Neutral
            'd': 4, // Easy
            'e': 5  // Very Easy
        },
        '5th': { // Do you prefer focusing on details or big picture first?
            'a': 1, // Details First
            'b': 3, // Balanced Focus
            'c': 5  // Big Picture First
        },

        // Memory Confidence Survey
        '6th': { // When introduced to a list of 10 items, how many do you remember?
            'a': 1, // 0-2
            'b': 2, // 3-5
            'c': 3, // 6-8
            'd': 4  // 9-10
        },
        '7th': { // How easy is it to remember a sequence of numbers?
            'a': 1, // Very Difficult
            'b': 2, // Difficult
            'c': 3, // Neutral
            'd': 4, // Easy
            'e': 5  // Very Easy
        },
        '8th': { // After reading a short paragraph, how well do you recall main details?
            'a': 1, // Not at all
            'b': 2, // Slightly
            'c': 3, // Moderately Well
            'd': 4, // Well
            'e': 5  // Very Well
        },
        '9th': { // How often do you forget where you placed everyday items?
            'a': 1, // Rarely
            'b': 2, // Occasionally
            'c': 3, // Frequently
            'd': 4, // Almost Always
            'e': 5  // Always
        },
        '10th': { // How likely are you to recall a word after 5 minutes?
            'a': 1, // Very Unlikely
            'b': 2, // Somewhat Unlikely
            'c': 3, // Somewhat Likely
            'd': 4, // Likely
            'e': 5  // Very Likely
        },

        // Common Knowledge Recall (General Facts)
        '11th': { // Who proposed the theory of general relativity?
            'einstein': 1,  // Answer is case-insensitive
        },
        '12th': { // In what year did WWI start?
            '1914': 1,
        },
        '13th': { // Who discovered gravity after seeing an apple fall?
            'newton': 1,  // Answer is case-insensitive
        },
        '14th': { // What is the largest ocean on Earth?
            'pacific ocean': 1,  // Answer is case-insensitive
        },
        '15th': { // Which country has the largest population?
            'india': 1,  // Answer is case-insensitive
        },

        // Short Term Memory (STM)
        '16th': { // How many circles were there? (e.g., ○ ■ ○ ○ ▲ ■ ○)
            'c': 1, // Correct Answer is 4 circles
        },

        // Visual Memory (e.g., colors, patterns)
        'color-recall': { // How many colors were there? (e.g., Red and Orange)
            '2': 2, // Correct Answer is 2 colors
        },
        
        // Working Memory (e.g., arithmetic, pattern recall)
        'working-memory': { // Reverse sequence or other working memory questions
            '38': 1,  // Correct answer is 38 for some calculations
        },
    };

    // Return points for the given answer
    return pointsMap[name] && pointsMap[name][value.toLowerCase()] || 0;
}

// Collect Points for Answers
function collectPoints() {
    // Cognitive Ability Survey
    totalPoints += getPointsForAnswer('1st', document.querySelector('input[name="1st"]:checked')?.value);
    totalPoints += getPointsForAnswer('2nd', document.querySelector('input[name="2nd"]:checked')?.value);
    totalPoints += getPointsForAnswer('3rd', document.querySelector('input[name="3rd"]:checked')?.value);
    totalPoints += getPointsForAnswer('4th', document.querySelector('input[name="4th"]:checked')?.value);
    totalPoints += getPointsForAnswer('5th', document.querySelector('input[name="5th"]:checked')?.value);

    // Memory Confidence Survey
    totalPoints += getPointsForAnswer('6th', document.querySelector('input[name="6th"]:checked')?.value);
    totalPoints += getPointsForAnswer('7th', document.querySelector('input[name="7th"]:checked')?.value);
    totalPoints += getPointsForAnswer('8th', document.querySelector('input[name="8th"]:checked')?.value);
    totalPoints += getPointsForAnswer('9th', document.querySelector('input[name="9th"]:checked')?.value);
    totalPoints += getPointsForAnswer('10th', document.querySelector('input[name="10th"]:checked')?.value);

    // Common Knowledge Recall
    totalPoints += getPointsForAnswer('11th', document.querySelector('input[name="11th"]').value);
    totalPoints += getPointsForAnswer('12th', document.querySelector('input[name="12th"]').value);
    totalPoints += getPointsForAnswer('13th', document.querySelector('input[name="13th"]').value);
    totalPoints += getPointsForAnswer('14th', document.querySelector('input[name="14th"]').value);
    totalPoints += getPointsForAnswer('15th', document.querySelector('input[name="15th"]').value);

    // Short Term Memory (STM)
    totalPoints += getPointsForAnswer('16th', document.querySelector('input[name="16th"]:checked')?.value);

    // Visual Memory
    totalPoints += getPointsForAnswer('color-recall', document.querySelector('input[name="color-recall"]').value);

    // Working Memory (for example reverse calculations or answers)
    totalPoints += getPointsForAnswer('working-memory', document.querySelector('input[name="working-memory"]').value);
}

function getPointsForAnswer(name, value) {
    const pointsMap = {
        // Cognitive Ability Survey
        '1st': { // How easily do you lose focus during tasks?
            'a': 1, // Never
            'b': 2, // Rarely
            'c': 3, // Sometimes
            'd': 4, // Often
            'e': 5  // Always
        },
        '2nd': { // How confident are you in making quick decisions?
            'a': 1, // Not Confident
            'b': 2, // Slightly Confident
            'c': 3, // Moderately Confident
            'd': 4, // Confident
            'e': 5  // Very Confident
        },
        '3rd': { // How often do you feel stuck when solving problems?
            'a': 1, // 0-1 days
            'b': 2, // 2-3 days
            'c': 3, // 4-5 days
            'd': 4, // 1 week
            'e': 5  // More than a week
        },
        '4th': { // Is it easy to connect new information to what you know?
            'a': 1, // Very Difficult
            'b': 2, // Difficult
            'c': 3, // Neutral
            'd': 4, // Easy
            'e': 5  // Very Easy
        },
        '5th': { // Do you prefer focusing on details or big picture first?
            'a': 1, // Details First
            'b': 3, // Balanced Focus
            'c': 5  // Big Picture First
        },

        // Memory Confidence Survey
        '6th': { // When introduced to a list of 10 items, how many do you remember?
            'a': 1, // 0-2
            'b': 2, // 3-5
            'c': 3, // 6-8
            'd': 4  // 9-10
        },
        '7th': { // How easy is it to remember a sequence of numbers?
            'a': 1, // Very Difficult
            'b': 2, // Difficult
            'c': 3, // Neutral
            'd': 4, // Easy
            'e': 5  // Very Easy
        },
        '8th': { // After reading a short paragraph, how well do you recall main details?
            'a': 1, // Not at all
            'b': 2, // Slightly
            'c': 3, // Moderately Well
            'd': 4, // Well
            'e': 5  // Very Well
        },
        '9th': { // How often do you forget where you placed everyday items?
            'a': 1, // Rarely
            'b': 2, // Occasionally
            'c': 3, // Frequently
            'd': 4, // Almost Always
            'e': 5  // Always
        },
        '10th': { // How likely are you to recall a word after 5 minutes?
            'a': 1, // Very Unlikely
            'b': 2, // Somewhat Unlikely
            'c': 3, // Somewhat Likely
            'd': 4, // Likely
            'e': 5  // Very Likely
        },

        // Common Knowledge Recall (General Facts)
        '11th': { // Who proposed the theory of general relativity?
            'einstein': 1,  // Answer is case-insensitive
        },
        '12th': { // In what year did WWI start?
            '1914': 1,
        },
        '13th': { // Who discovered gravity after seeing an apple fall?
            'newton': 1,  // Answer is case-insensitive
        },
        '14th': { // What is the largest ocean on Earth?
            'pacific ocean': 1,  // Answer is case-insensitive
        },
        '15th': { // Which country has the largest population?
            'india': 1,  // Answer is case-insensitive
        },

        // Short Term Memory (STM)
        '16th': { // How many circles were there? (e.g., ○ ■ ○ ○ ▲ ■ ○)
            'c': 1, // Correct Answer is 4 circles
        },

        // Visual Memory (e.g., colors, patterns)
        'color-recall': { // How many colors were there? (e.g., Red and Orange)
            '2': 2, // Correct Answer is 2 colors
        },
        
        // Working Memory (e.g., arithmetic, pattern recall)
        'working-memory': { // Reverse sequence or other working memory questions
            '38': 1,  // Correct answer is 38 for some calculations
        },
    };

    // Return points for the given answer
    return pointsMap[name] && pointsMap[name][value.toLowerCase()] || 0;
}

// Collect Points for Answers
function collectPoints() {
    // Cognitive Ability Survey
    totalPoints += getPointsForAnswer('1st', document.querySelector('input[name="1st"]:checked')?.value);
    totalPoints += getPointsForAnswer('2nd', document.querySelector('input[name="2nd"]:checked')?.value);
    totalPoints += getPointsForAnswer('3rd', document.querySelector('input[name="3rd"]:checked')?.value);
    totalPoints += getPointsForAnswer('4th', document.querySelector('input[name="4th"]:checked')?.value);
    totalPoints += getPointsForAnswer('5th', document.querySelector('input[name="5th"]:checked')?.value);

    // Memory Confidence Survey
    totalPoints += getPointsForAnswer('6th', document.querySelector('input[name="6th"]:checked')?.value);
    totalPoints += getPointsForAnswer('7th', document.querySelector('input[name="7th"]:checked')?.value);
    totalPoints += getPointsForAnswer('8th', document.querySelector('input[name="8th"]:checked')?.value);
    totalPoints += getPointsForAnswer('9th', document.querySelector('input[name="9th"]:checked')?.value);
    totalPoints += getPointsForAnswer('10th', document.querySelector('input[name="10th"]:checked')?.value);

    // Common Knowledge Recall
    totalPoints += getPointsForAnswer('11th', document.querySelector('input[name="11th"]').value);
    totalPoints += getPointsForAnswer('12th', document.querySelector('input[name="12th"]').value);
    totalPoints += getPointsForAnswer('13th', document.querySelector('input[name="13th"]').value);
    totalPoints += getPointsForAnswer('14th', document.querySelector('input[name="14th"]').value);
    totalPoints += getPointsForAnswer('15th', document.querySelector('input[name="15th"]').value);

    // Short Term Memory (STM)
    totalPoints += getPointsForAnswer('16th', document.querySelector('input[name="16th"]:checked')?.value);

    // Visual Memory
    totalPoints += getPointsForAnswer('color-recall', document.querySelector('input[name="color-recall"]').value);

    // Working Memory (for example reverse calculations or answers)
    totalPoints += getPointsForAnswer('working-memory', document.querySelector('input[name="working-memory"]').value);
}

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
