
// GLOBAL VARIABLES PLS PLSPLS DONT TOUCH NA
const timedPages = [
    'fourthPage', 'fifthPage', 'sixthPage',
    'seventhPage', 'eighthPage', 'ninthPage', 'tenthPage',
    'thirteenthPage'
];

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

let currentPageIndex = 0; 
let totalPoints = 0;
const nextButtons = document.querySelectorAll('.next-btn');


// START BUTTON HANDLER (FIXED: Validation works and stops the skip FINALLLYYY)


document.getElementById('start-btn').addEventListener('click', function(event) {
    event.preventDefault(); // 1. Always prevent the default form action

    const startPage = document.getElementById('info');
    
    // Selects only the required text inputs 
    const inputs = startPage.querySelectorAll('input[type="text"][required]'); 
    
    let allFilled = true;

    for (const input of inputs) {
        if (input.value.trim() === '') {
            allFilled = false;
            break; 
        }
    }

    if (!allFilled) {
        alert('Please fill in all required fields before starting.');
        return; // 
    }

    startPage.style.display = 'none';
    
    currentPageIndex++; 
    
    if (currentPageIndex < pages.length) {
        document.getElementById(pages[currentPageIndex]).style.display = 'block';
    }
}); 


// CORE VALIDATION FUNCTION (THIS IS NEW PLEASE DONT TOUCH THIS I BEG OF YOU THIS IS SO IMPORTANT IT VALIDATES THE INPUT BOXES.)

/**
 * Checks if all required inputs (text) on a given page are filled.
 */
function validatePage(pageElement) {
    let isValid = true;

    // Check radio groups
    const radioGroups = {};
    pageElement.querySelectorAll('input[type="radio"][required]').forEach(radio => {
        if (!radioGroups[radio.name]) radioGroups[radio.name] = false;
        if (radio.checked) radioGroups[radio.name] = true;
    });

    for (const group in radioGroups) {
        if (!radioGroups[group]) {
            alert('Please answer all required questions!');
            isValid = false;
            break;
        }
    }

    // Check text inputs
    pageElement.querySelectorAll('input[type="text"][required]').forEach(input => {
        if (input.value.trim() === '') {
            alert('Please fill all required fields!');
            isValid = false;
        }
    });

    return isValid;
}


///////////////////////////////////TIMER////////////////////////////////////////////////
function startTimedPage(pageId){
    if (!timedPages.includes(pageId)) return;

    const page = document.getElementById(pageId);
    const memorize = page.querySelector(".memorize, .memorize-view");
    const recall = page.querySelector(".recall, .recall-view");

    if (!memorize || !recall) return;

    memorize.style.display = 'block';
    recall.style.display = 'none';

    let timeLeft = 5;

    const timer = document.getElementById("timer");
    if (timer) {
        timer.style.display = "block";
        timer.textContent = timeLeft;
    }

    const countdown = setInterval(() => {
        timeLeft--;
        if (timer) timer.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(countdown)
            if (timer) timer.style.display = "none";

            if (memorize) memorize.style.display = "none";

            if (recall) recall.style.display = "block";
        }
    }, 1000);
}


// NEXT BUTTON HANDLER (ETO UNG PROBLEM REN, PERO MAY VALIDATION NA SYA SO DI NA MAGSSKIP

nextButtons.forEach(button => {
    button.addEventListener('click', function(event){
        
        const currentPageId = pages[currentPageIndex];
        const currentPage = document.getElementById(currentPageId);

        if (currentPageId !== 'btn' && !validatePage(currentPage)) {
            alert('Please answer all required questions before proceeding.');
            return;
        }

        if (currentPageId !== 'info' && currentPageId !== 'btn') {
             calculatePagePoints(currentPage);
        }

        if (currentPage) currentPage.style.display = 'none';

        currentPageIndex++;

        if (currentPageIndex < pages.length) {

            const nextPageId = pages[currentPageIndex];
            const nextPage = document.getElementById(nextPageId);

            nextPage.style.display = 'block';

            if (nextPageId !== 'visual-add') {
                 startTimedPage(nextPageId);
            }

             // DISPLAY SCORE IF FINAL PAGE
            if (nextPageId === 'btn') {
            const finalScoreEl = document.getElementById('final-score');
            if (finalScoreEl) finalScoreEl.textContent = totalPoints;
            }

        } else {
            alert('Test Finished! Submit your results.');
            button.disabled = true; 
        }
    })
})

function getPointsForAnswer(name, value) {
    // Note: The keys here MUST match the 'name' attributes in your HTML so it doesnt get confused
    const pointsMap = {
        // Cognitive Ability Survey (1st-5th)
        '1st': { 'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5 },
        '2nd': { 'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5 },
        '3rd': { 'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5 },
        '4th': { 'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5 },
        '5th': { 'a': 1, 'b': 3, 'c': 5 },

        // Memory Confidence Survey (6th-10th)
        '6th': { 'a': 1, 'b': 2, 'c': 3, 'd': 4 },
        '7th': { 'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5 },
        '8th': { 'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5 },
        '9th': { 'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5 },
        '10th': { 'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5 },

        // Common Knowledge Recall (3rd Page: using CK1-CK5 from your HTML)
        'CK1': { 'albert einstein': 1, 'einstein': 1 }, 
        'CK2': { '1914': 1 },
        'CK3': { 'isaac newton': 1, 'newton': 1 }, 
        'CK4': { 'pacific ocean': 1, 'pacific': 1 }, 
        'CK5': { 'india': 1 }, 

        // Short Term Memory (STM - 7th Page)
        'stm_word1': { 
            'vase': 1, 'tiger': 1, 'hat': 1, 'spade': 1,
            'orange': 1, 'ice cream': 1, 'blue': 1, 'guitar': 1
        },
        'stm_word2': { 
            'rectangle': 1, 'alphabet': 1, 'bathroom': 1, 'hydrogen': 1,
            'observing': 1, 'comparison': 1, 'product': 1, 'solution': 1
        },

        // Short Term Memory circle question
        '16th': { 'c': 1 }, 

        // Working Memory (11th Page - Math problem)
        'multiply': { '33': 1 }, // 6 * 7 = 42. 42 - 9 = 33. **Correct Answer**

        // Working Memory
        'number-reverse': { '31724': 1 }, // 4-2-7-1-3 reversed
        'multiply': { '33': 1 }, // 6*7-9
        'no-charger': { 'notebookusb': 1, 'notebook and usb': 1 }, // cleaned answers
        '16th': { 'c': 1 }, // circles
        '7+6x2': { 'error': 1, 'true': 0 }, // final page

        // Visual Memory
        'visualMemory': { 'round1': 1, 'round2': 1, 'round3': 1, 'round4': 1, 'round5': 1 }
    };

    const cleanedValue = value ? value.toString().toLowerCase().replace(/[^a-z0-9\s]/g, '').trim() : '';

    return pointsMap[name] && pointsMap[name][cleanedValue] || 0;
}

/**
 * Calculates the score for the current page before advancing.
 */
function calculatePagePoints(pageElement) {
    let pagePoints = 0;
    const inputs = pageElement.querySelectorAll('input, select'); 

    inputs.forEach(input => {
        let value = input.value;
        if (input.type === 'radio' && !input.checked) {
            return; 
        }
        if (input.type === 'radio') {
            value = input.value;
        }

        // Add points for matching name/value pairs
        pagePoints += getPointsForAnswer(input.name, value);
    });

    totalPoints += pagePoints;
}

// FINAL FORM SUBMISSION LOGIC (using fetch)

document.querySelector("#btn button")?.addEventListener("click", async function (e) {
    if (this.disabled) return;
    
    e.preventDefault(); 

    const name = document.getElementById("name")?.value;
    const email = document.getElementById("email")?.value;
    const age = document.getElementById("age")?.value;
    const program = document.getElementById("program")?.value;

    this.disabled = true; 

    const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            email,
            age,
            program,
            finalScore: totalPoints
        })
    });

    const result = await response.text();
    alert(`Submission complete. Server response: ${result}`);
});


// VISUAL MEMORY GAME LOGIC (with score)

const gridSize = 5; 
const flashCount = 5; 

let flashTiles = [];
let clickable = false;
let score = 0; // track score

const grid = document.getElementById('grid');
const message = document.getElementById('message');
const startBtn = document.getElementById('startBtn'); 

function createGrid() {
    if (!grid) return; 
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
        if (message) message.textContent = `🎉 All ${maxRounds} rounds complete! Your final score: ${score}`;
        clickable = false;
        return;
    }

    currentRound++;
    clickable = false;
    flashTiles = [];
    if (message) message.textContent = `Round ${currentRound} of ${maxRounds}. Current score: ${score}`;

    const total = gridSize * gridSize;
    while (flashTiles.length < flashCount) {
        const r = Math.floor(Math.random() * total);
        if (!flashTiles.includes(r)) {
            flashTiles.push(r);
        }
    }

    flashTiles.forEach(i => {
        const t = grid.querySelector(`.tile[data-index="${i}"]`);
        if (t) t.classList.add('flash');
    });

    setTimeout(() => {
        flashTiles.forEach(i => {
            const t = grid.querySelector(`.tile[data-index="${i}"]`);
            if (t) t.classList.remove('flash');
        });
        clickable = true;
        if (message) message.textContent = 'Click the tiles you saw flash.';
    }, 1000); 
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
        const correct = flashTiles.every(i => selected.includes(i));
        if (correct) {
            score++; // NEW: increment score for correct round
            if (message) message.textContent = `Correct! You passed. Current score: ${score}`;
        } else {
            if (message) message.textContent = `Oopsies! Current score: ${score}`;
        }
        setTimeout(() => {
            if (grid) grid.querySelectorAll('.tile').forEach(t => t.classList.remove('selected'));
            selected = [];
            startRound();
        }, 1500);
    }
}

if (startBtn) {
    startBtn.addEventListener('click', () => {
        createGrid();
        score = 0; // reset score on new game
        currentRound = 0;
        startRound();
    });
}

createGrid();

// After the visual memory game completes all rounds, add its score to totalPoints
const visualNextBtn = document.querySelector('#visual-add .next-btn');

if (visualNextBtn) {
    visualNextBtn.addEventListener('click', () => {
        totalPoints += score; // Add visual memory game score to overall points
        console.log('Visual Memory Score added:', score, 'Total Points:', totalPoints);
    });
}

