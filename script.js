let boxes = document.querySelectorAll(".boxes");
let turn1 = document.querySelector(".turn1");
let turn2 = document.querySelector(".turn2");
let msg = document.querySelector(".msg");
let messageText = document.getElementById("messageText");
let reset = document.getElementById("reset");
let ng = document.getElementById("ng");
let aiModeBtn = document.getElementById("aiMode");
let gameOver = false;
let turnX = true;
let aiMode = false;
let clickSound = new Audio("Sound Effect/click.mp3");
let winnerSound = new Audio("Sound Effect/winner.mp3");
let drawSound = new Audio("Sound Effect/draw.mp3");

// Scoreboard
let xScore = 0, oScore = 0, drawScore = 0;
let xScoreEl = document.getElementById("xScore");
let oScoreEl = document.getElementById("oScore");
let drawScoreEl = document.getElementById("drawScore");

let WinnerCondition = [

    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]

]

// Reset / New Game
function resetGame() {
    boxes.forEach(box => {
        box.innerText = "";
        box.disabled = false;
        box.classList.add("hover");
        box.classList.remove("b-s");
        box.classList.remove("winner");
        box.classList.remove("loser");
    });
    msg.classList.add("hide");
    turnX = true;
    gameOver = false;
}
reset.addEventListener('click', resetGame);

// New Game (Reset Board + Scoreboard)
function newGame() {
    resetGame(); 
    xScore = 0;
    oScore = 0;
    drawScore = 0;
    xScoreEl.innerText = xScore;
    oScoreEl.innerText = oScore;
    drawScoreEl.innerText = drawScore;
}
ng.addEventListener('click', newGame);

// Toggle AI Mode
aiModeBtn.addEventListener("click", () => {
    aiMode = !aiMode;
    aiModeBtn.innerText = aiMode ? "Play vs Human" : "Play vs Computer";
    resetGame();
});

// Player moves
boxes.forEach(box => {
    box.addEventListener('click', () => {
        if (box.innerText !== "") return;
        clickSound.play();
        if (turnX) {
            box.innerText = "X";
            box.style.color = "rgb(174,51,96)";
            turn2.classList.add("b-s");
            turn1.classList.remove("b-s");
            turnX = false;
        } else {
            box.innerText = "O";
            box.style.color = "rgb(17,52,182)";
            turn1.classList.add("b-s");
            turn2.classList.remove("b-s");
            turnX = true;
        }
        checkWinner();

        // AI Move
        if (aiMode && !turnX) {
            setTimeout(aiMove, 500);
        }
    });
});

// AI Logic (easy: random empty box)
function aiMove() {
    let empty = [...boxes].filter(b => b.innerText === "");
    if (empty.length === 0) return;
    let randomBox = empty[Math.floor(Math.random() * empty.length)];
    randomBox.innerText = "O";
    randomBox.style.color = "rgb(17,52,182)";
    turn1.classList.add("b-s");
    turn2.classList.remove("b-s");
    turnX = true;
    checkWinner();
}

// Check Winner
function checkWinner() {
    if (gameOver) return;
    let filled = 0;
    for (let condition of WinnerCondition) {
        let box1 = boxes[condition[0]].innerText;
        let box2 = boxes[condition[1]].innerText;
        let box3 = boxes[condition[2]].innerText;

        if (box1 !== "" && box2 !== "" && box3 !== "") {
            if (box1 === box2 && box2 === box3) {
                showResult(`${box1} Wins!`, box1);
                return;
            }
        }
    }

    boxes.forEach(box => { if (box.innerText !== "") filled++; });
    if (filled === 9) {
        showResult("It's a Draw!", "draw");
        gameOver = true;
    }
}

// Show Result
function showResult(result, winner) {
    boxes.forEach(box => {
        box.disabled = true;
        box.classList.remove("hover");
    });
    msg.classList.remove("hide");
    messageText.innerText = result;

    if (winner === "X") {
        messageText.style.color = "rgb(174, 51 , 96)";
        xScore++;
        xScoreEl.innerText = xScore;
        winnerSound.play();

        // Winner highlight aur loser fade
        WinnerCondition.forEach(condition => {
            if (boxes[condition[0]].innerText === "X" &&
                boxes[condition[1]].innerText === "X" &&
                boxes[condition[2]].innerText === "X") {

                condition.forEach(i => boxes[i].classList.add("winner"));
                boxes.forEach((box, idx) => {
                    if (!condition.includes(idx)) box.classList.add("loser");
                });
            }
        });

    } else if (winner === "O") {
        messageText.style.color = "rgb(17, 52, 182)";
        oScore++;
        oScoreEl.innerText = oScore;
        winnerSound.play();

        // Winner highlight and loser fade
        WinnerCondition.forEach(condition => {
            if (boxes[condition[0]].innerText === "O" &&
                boxes[condition[1]].innerText === "O" &&
                boxes[condition[2]].innerText === "O") {

                condition.forEach(i => boxes[i].classList.add("winner"));
                boxes.forEach((box, idx) => {
                    if (!condition.includes(idx)) box.classList.add("loser");
                });
            }
        });

    } else {
        messageText.style.color = "#fff";
        drawScore++;
        drawScoreEl.innerText = drawScore;
        drawSound.play();
    }
    gameOver = true;
}

