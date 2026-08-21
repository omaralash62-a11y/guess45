// ================================
// GUESS 45 - WEB VERSION
// ================================

let score = 0;
let bestScore = Number(localStorage.getItem("bestScore")) || 0;

let lives = 3;
let roundNumber = 1;

let coins = Number(localStorage.getItem("coins")) || 0;
let xp = Number(localStorage.getItem("xp")) || 0;
let level = Number(localStorage.getItem("level")) || 1;

let combo = 0;
let freeGuess = false;

let rewardMilestone =
    Number(localStorage.getItem("rewardMilestone")) || 0;

let secret = 0;
let timeLeft = 45;

let gameRunning = false;
let choicesMode = false;
let timer = null;


// ================================
// SAVE
// ================================

function saveData() {

    localStorage.setItem("bestScore", bestScore);
    localStorage.setItem("coins", coins);
    localStorage.setItem("xp", xp);
    localStorage.setItem("level", level);
    localStorage.setItem(
        "rewardMilestone",
        rewardMilestone
    );
}


// ================================
// LOAD MENU
// ================================

function updateMenu() {

    document.getElementById("menuLevel").textContent = level;
    document.getElementById("menuXP").textContent = xp;
    document.getElementById("menuCoins").textContent = coins;
    document.getElementById("menuBest").textContent = bestScore;
}


// ================================
// START GAME
// ================================

function startGame() {

    score = 0;
    lives = 3;
    roundNumber = 1;
    combo = 0;
    freeGuess = false;

    secret =
        Math.floor(Math.random() * 100) + 1;

    timeLeft = 45;

    gameRunning = true;
    choicesMode = false;

    document.getElementById("menu").classList.add("hidden");
    document.getElementById("gameScreen").classList.remove("hidden");

    document.getElementById("round").textContent = roundNumber;
    document.getElementById("score").textContent = score;
    document.getElementById("coins").textContent = coins;

    updateLives();

    document.getElementById("combo").textContent =
        "COMBO x0";

    document.getElementById("timer").textContent =
        timeLeft;

    document.getElementById("message").textContent =
        "GUESS THE NUMBER!";

    document.getElementById("guessInput").value = "";

    document.getElementById("guessInput").disabled = false;

    document.querySelector(".guess").disabled = false;

    hideChoices();

    startTimer();

    document.getElementById("guessInput").focus();
}


// ================================
// TIMER
// ================================

function startTimer() {

    clearInterval(timer);

    timer = setInterval(() => {

        if (!gameRunning || choicesMode) {
            return;
        }

        timeLeft--;

        document.getElementById("timer").textContent =
            timeLeft;

        if (timeLeft <= 10) {

            document.getElementById("timer").style.color =
                "#ff0000";
        }

        if (timeLeft <= 5) {

            document.getElementById("message").textContent =
                "HURRY!!!";
        }

        if (timeLeft <= 0) {

            clearInterval(timer);

            timeIsUp();
        }

    }, 1000);
}


// ================================
// GUESS
// ================================

function makeGuess() {

    if (!gameRunning) {
        return;
    }

    const input =
        document.getElementById("guessInput");

    if (input.value === "") {

        showMessage("ENTER A NUMBER!");

        input.focus();

        return;
    }

    const number = Number(input.value);

    if (number < 1 || number > 100) {

        showMessage(
            "NUMBER MUST BE 1 - 100!"
        );

        return;
    }


    // WRONG
    if (number !== secret) {

        if (freeGuess) {

            freeGuess = false;

            showMessage(
                "FREE GUESS USED!"
            );

        } else {

            combo = 0;

            if (number < secret) {

                showMessage("HIGHER!");

            } else {

                showMessage("LOWER!");
            }
        }

        document.getElementById("combo").textContent =
            "COMBO x" + combo;

    }


    // CORRECT
    else {

        combo++;

        score += 10;
        coins += 1;

        addXP(10);

        checkScoreReward();

        updateScore();
        updateCoins();

        document.getElementById("combo").textContent =
            "COMBO x" + combo;

        showMessage(
            "CORRECT!\n+10 SCORE"
        );

        gameRunning = false;

        clearInterval(timer);

        saveData();

        setTimeout(
            nextRound,
            1000
        );
    }

    input.value = "";
}


// ================================
// SCORE REWARD
// ================================

function checkScoreReward() {

    const milestone =
        Math.floor(score / 100);

    if (milestone > rewardMilestone) {

        const difference =
            milestone - rewardMilestone;

        const reward =
            difference * 20;

        coins += reward;

        rewardMilestone = milestone;

        showMessage(
            "SCORE REWARD!\n+" +
            reward +
            " COINS"
        );

        updateCoins();

        saveData();
    }
}


// ================================
// XP
// ================================

function addXP(amount) {

    xp += amount;

    let needed =
        level * 100;

    while (xp >= needed) {

        xp -= needed;

        level++;

        coins += 25;

        showMessage(
            "LEVEL UP!\nLEVEL " +
            level
        );

        needed =
            level * 100;
    }

    saveData();
}


// ================================
// +10 SECONDS
// ================================

function plusTime() {

    if (!gameRunning) {
        return;
    }

    if (coins < 10) {

        showMessage(
            "NOT ENOUGH COINS!"
        );

        return;
    }

    coins -= 10;

    timeLeft += 10;

    document.getElementById("timer").textContent =
        timeLeft;

    showMessage(
        "+10 SECONDS!"
    );

    updateCoins();

    saveData();
}


// ================================
// HINT
// ================================

function useHint() {

    if (!gameRunning) {
        return;
    }

    if (coins < 15) {

        showMessage(
            "NOT ENOUGH COINS!"
        );

        return;
    }

    coins -= 15;

    const distance =
        [5, 8, 10][
            Math.floor(Math.random() * 3)
        ];

    const low =
        Math.max(
            1,
            secret - distance
        );

    const high =
        Math.min(
            100,
            secret + distance
        );

    showMessage(
        "HINT: " +
        low +
        " - " +
        high
    );

    updateCoins();

    saveData();
}


// ================================
// FREE GUESS
// ================================

function useFreeGuess() {

    if (!gameRunning) {
        return;
    }

    if (freeGuess) {

        showMessage(
            "FREE GUESS ACTIVE!"
        );

        return;
    }

    if (coins < 20) {

        showMessage(
            "NOT ENOUGH COINS!"
        );

        return;
    }

    coins -= 20;

    freeGuess = true;

    showMessage(
        "FREE GUESS ACTIVE!"
    );

    updateCoins();

    saveData();
}


// ================================
// WATCH AD - COINS
// TEST VERSION
// ================================

function watchAdCoins() {

    showMessage(
        "TEST AD...\nPLEASE WAIT"
    );

    setTimeout(() => {

        coins += 10;

        updateCoins();

        showMessage(
            "AD REWARD!\n+10 COINS"
        );

        saveData();

    }, 2000);
}


// ================================
// WATCH AD - TIME
// TEST VERSION
// ================================

function watchAdTime() {

    showMessage(
        "TEST AD...\nPLEASE WAIT"
    );

    setTimeout(() => {

        if (gameRunning) {

            timeLeft += 10;

            document.getElementById("timer")
                .textContent = timeLeft;

            showMessage(
                "AD REWARD!\n+10 SECONDS"
            );

        } else {

            showMessage(
                "START A ROUND FIRST!"
            );
        }

    }, 2000);
}


// ================================
// TIME UP
// ================================

function timeIsUp() {

    gameRunning = false;
    choicesMode = true;

    document.getElementById("guessInput")
        .disabled = true;

    document.querySelector(".guess")
        .disabled = true;

    showMessage(
        "TIME'S UP! CHOOSE!"
    );

    let numbers = [];

    while (numbers.length < 3) {

        const n =
            Math.floor(
                Math.random() * 100
            ) + 1;

        if (
            n !== secret &&
            !numbers.includes(n)
        ) {

            numbers.push(n);
        }
    }

    numbers.push(secret);

    numbers.sort(
        () => Math.random() - 0.5
    );

    const buttons =
        document.querySelectorAll(
            "#choices button"
        );

    buttons.forEach(
        (button, index) => {

            button.textContent =
                numbers[index];

        }
    );

    document.getElementById("choices")
        .classList.remove("hidden");
}


// ================================
// CHOICE
// ================================

function choiceSelected(button) {

    if (!choicesMode) {
        return;
    }

    const selected =
        Number(button.textContent);

    choicesMode = false;

    hideChoices();

    if (selected === secret) {

        score += 10;

        coins += 1;

        addXP(10);

        checkScoreReward();

        showMessage(
            "LUCKY!\n+10 SCORE"
        );

        updateScore();
        updateCoins();

    } else {

        lives--;

        combo = 0;

        updateLives();

        showMessage(
            "WRONG!\nLIFE LOST!"
        );
    }

    saveData();

    if (lives <= 0) {

        setTimeout(
            gameOver,
            1000
        );

    } else {

        setTimeout(
            nextRound,
            1000
        );
    }
}


// ================================
// NEXT ROUND
// ================================

function nextRound() {

    roundNumber++;

    secret =
        Math.floor(
            Math.random() * 100
        ) + 1;

    timeLeft =
        Math.max(
            15,
            45 - ((roundNumber - 1) * 2)
        );

    gameRunning = true;
    choicesMode = false;

    document.getElementById("guessInput")
        .disabled = false;

    document.querySelector(".guess")
        .disabled = false;

    document.getElementById("guessInput")
        .value = "";

    document.getElementById("timer")
        .textContent = timeLeft;

    document.getElementById("timer")
        .style.color = "#ff1717";

    document.getElementById("round")
        .textContent = roundNumber;

    document.getElementById("combo")
        .textContent =
        "COMBO x" + combo;

    showMessage(
        "NEW ROUND..."
    );

    hideChoices();

    startTimer();

    document.getElementById("guessInput")
        .focus();
}


// ================================
// SCORE UPDATE
// ================================

function updateScore() {

    document.getElementById("score")
        .textContent = score;

    if (score > bestScore) {

        bestScore = score;

        saveData();
    }
}


// ================================
// COINS UPDATE
// ================================

function updateCoins() {

    document.getElementById("coins")
        .textContent = coins;
}


// ================================
// LIVES
// ================================

function updateLives() {

    let text = "";

    for (let i = 0; i < lives; i++) {

        text += "LIFE ";

    }

    document.getElementById("lives")
        .textContent = text;
}


// ================================
// HIDE CHOICES
// ================================

function hideChoices() {

    document.getElementById("choices")
        .classList.add("hidden");
}


// ================================
// GAME OVER
// ================================

function gameOver() {

    gameRunning = false;
    choicesMode = false;

    clearInterval(timer);

    showMessage(
        "GAME OVER\nSCORE: " + score
    );

    document.getElementById("guessInput")
        .disabled = true;

    document.querySelector(".guess")
        .disabled = true;

    saveData();

    setTimeout(
        backToMenu,
        2000
    );
}


// ================================
// BACK TO MENU
// ================================

function backToMenu() {

    gameRunning = false;
    choicesMode = false;

    clearInterval(timer);

    saveData();

    document.getElementById("gameScreen")
        .classList.add("hidden");

    document.getElementById("menu")
        .classList.remove("hidden");

    updateMenu();
}


// ================================
// MESSAGE
// ================================

function showMessage(text) {

    document.getElementById("message")
        .textContent = text;
}


// ================================
// ENTER KEY
// ================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter" &&
            gameRunning
        ) {

            makeGuess();
        }

    }
);


// ================================
// INITIALIZE
// ================================

updateMenu();