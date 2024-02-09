document.addEventListener("DOMContentLoaded", function () {
    const board = document.getElementById("board");
    const scoreboard = document.getElementById("scoreboard");
    let round = 0;
    let startingPlayer = "X"; 
    let currentPlayer = startingPlayer;
    let cells = Array(9).fill(null);
    let winnerCells = null;
    let playerXScore = 0;
    let playerOScore = 0;
    let winRate = 50;

    function checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], 
            [0, 3, 6], [1, 4, 7], [2, 5, 8], 
            [0, 4, 8], [2, 4, 6]             
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
                winnerCells = pattern;
                return cells[a];
            }
        }

        return null;
    }

    function checkDraw() {
        return cells.every(cell => cell !== null);
    }

    function handleCellClick(index) {
        if (cells[index] || checkWinner() || currentPlayer === "O") {
            return;
        }

        cells[index] = currentPlayer;
        renderBoard();

        const winner = checkWinner();
        if (winner) {
            updateScore(winner);
            renderBoard(); 
            setTimeout(resetGame, 2000); 
        } else if (checkDraw()) {
            setTimeout(resetGame, 2000);
        } else {
            currentPlayer = "O";
            setTimeout(makeBotMove, 500); 
        }
    }

    function updateScore(winner) {
        if (winner === "X") {
            playerXScore++;
        } else {
            playerOScore++;
        }

        renderScoreboard();
    }

    function renderScoreboard() {
        const playerXClass = currentPlayer === "X" ? "current-player" : "";
        const playerOClass = currentPlayer === "O" ? "current-player" : "";
    
        scoreboard.innerHTML = `
            <p class="${playerXClass} player">X : ${playerXScore}</p>
            <p class="player">Round ${round}</p>
            <p class="${playerOClass} player">O : ${playerOScore}</p>
        `;
    }

    function renderBoard() {
        renderScoreboard();
        board.innerHTML = "";
        cells.forEach((value, index) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            if (winnerCells && winnerCells.includes(index)) {
                cell.classList.add("win");
            }
            cell.textContent = value;
            cell.addEventListener("click", () => handleCellClick(index));
            board.appendChild(cell);
        });
    }

    function resetGame() {
        round += 1;
        winRate = 100*(playerXScore-playerOScore)/(playerXScore+playerOScore);
        cells = Array(9).fill(null);
        winnerCells = null;
        renderBoard();

        
        currentPlayer = startingPlayer;
        startingPlayer = startingPlayer === "X" ? "O" : "X";

        if (currentPlayer === "O") {
            setTimeout(makeBotMove, 500); 
        }

        renderScoreboard();
    }

    function makeBotMove() {
        const botMove = determineBotMove(cells, currentPlayer);
    
        cells[botMove] = "O";
        renderBoard();
    
        const winner = checkWinner();
        if (winner) {
            updateScore(winner);
            renderBoard();
            setTimeout(resetGame, 2000);
        } else if (checkDraw()) {
            setTimeout(resetGame, 2000);
        } else {
            currentPlayer = "X";
        }
    }

    
    renderScoreboard();
    resetGame();
});
