document.addEventListener("DOMContentLoaded", function () {
    const board = document.getElementById("board");
    const scoreboard = document.getElementById("scoreboard");
    const gameModeSelect = document.getElementById("gameMode");
    let currentPlayer = "X";
    let cells = Array(9).fill(null);
    let winnerCells = null;
    let playerXScore = 0;
    let playerOScore = 0;

    function checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
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
        if (cells[index] || checkWinner() || (gameModeSelect.value === "bot" && currentPlayer === "O")) {
            return;
        }

        cells[index] = currentPlayer;
        renderBoard();

        const winner = checkWinner();
        if (winner) {
            updateScore(winner);
            renderBoard(); // Render board untuk menampilkan baris menang dengan warna
            setTimeout(resetGame, 2000); // Delay 2000ms (2 detik) sebelum mereset permainan
        } else if (checkDraw()) {
            alert("It's a draw!");
            resetGame();
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            if (gameModeSelect.value === "bot" && currentPlayer === "O") {
                setTimeout(makeBotMove, 500); // Delay sebentar sebelum bot bergerak
            }
        }
    }

    function updateScore(winner) {
        if (winner === "X") {
            playerXScore++;
        } else {
            playerOScore++;
        }
    }

    function renderScoreboard() {
        const playerXClass = currentPlayer === "X" ? "current-player" : "";
        const playerOClass = currentPlayer === "O" ? "current-player" : "";
    
        scoreboard.innerHTML = `
            <span class="${playerXClass}">Player X: ${playerXScore}</span> | 
            <span class="${playerOClass}">Player O: ${playerOScore}</span>
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
        cells = Array(9).fill(null);
        winnerCells = null;
        renderBoard();
        if (gameModeSelect.value === "bot") {
            currentPlayer = Math.random() < 0.5 ? "X" : "O"; // Randomly choose starting player
            if (currentPlayer === "O") {
                setTimeout(makeBotMove, 500); // Delay sebentar sebelum bot bergerak
            }
        } else {
            currentPlayer = "X";
        }
    }

    function makeBotMove() {
        const availableMoves = cells.reduce((acc, value, index) => {
            if (!value) {
                acc.push(index);
            }
            return acc;
        }, []);

        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        const botMove = availableMoves[randomIndex];

        cells[botMove] = "O";
        renderBoard();

        const winner = checkWinner();
        if (winner) {
            updateScore(winner);
            renderBoard(); // Render board untuk menampilkan baris menang dengan warna
            setTimeout(resetGame, 2000); // Delay 2000ms (2 detik) sebelum mereset permainan
        } else if (checkDraw()) {
            alert("It's a draw!");
            setTimeout(resetGame, 2000);
        } else {
            currentPlayer = "X";
        }
    }

    // Fungsi untuk mereset permainan ketika mode permainan berubah
    function changeGameMode() {
        resetGame();
    }

    // Render papan pertama kali
    renderScoreboard();
    resetGame();
});
