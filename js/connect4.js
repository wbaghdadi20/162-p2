document.addEventListener('DOMContentLoaded', function() {
    createBoard(6, 7);
    initializeGame();
});

let currentPlayer = 'red';
let gameActive = true;
let board = document.querySelector('.board');

function createBoard(rows, cols) {
    board.innerHTML = '';

    for (let c = 0; c < cols; c++){
        const columns = document.createElement('div');
        columns.classList.add('column');
        for (let r = 0; r < rows; r++){
            const circle = document.createElement('div');
            circle.classList.add('circle');
            columns.appendChild(circle);
        }
        board.appendChild(columns);
    }
}

function initializeGame() {
    const columns = document.querySelectorAll('.column');
    columns.forEach((col, index) => {
        col.addEventListener('click', () => handleColumnClick(index));
    });
    const playerSpan = document.querySelector('.current-player');
    playerSpan.textContent = 'Red'; 
    playerSpan.style.color = 'red';
    currentPlayer = 'red';
    gameActive = true;
}

function handleColumnClick(colIndex) {
    if (!gameActive) return;

    const columns = document.querySelectorAll('.column');
    const circles = Array.from(columns[colIndex].children).reverse();  // Get all circles in the column, reversed
    for (let circle of circles) {
        if (!circle.style.backgroundColor) { // Check if the circle is not yet filled
            circle.style.backgroundColor = currentPlayer; // Set the player's color
            let winner = checkWinner();
            console.log(winner);
            if (winner) {
                gameActive = false;
                columns.forEach(col => col.style.pointerEvents = "none");
                const playerInfo = document.querySelector('.player-info');
                if (winner === 'tie') {
                    playerInfo.innerHTML = "Draw"; // Plain text for draw
                    playerInfo.style.color = 'black'; // Default color for text
                } else {
                    playerInfo.innerHTML = `Winner: <span style="color: ${winner};">${winner.charAt(0).toUpperCase() + winner.slice(1)}</span>`;
                }
            }
            togglePlayer(); // Switch to the other player
            break;
        }
    }
}

function checkWinner() {
    const rows = 6;
    const cols = 7;
    const board_array = [];
    
    for (let c = 0; c < cols; c++) {
        const column = document.querySelectorAll('.column')[c].children;
        board_array[c] = [];
        for (let r = 0; r < rows; r++) {
            board_array[c][r] = column[r].style.backgroundColor;
        }
    }

    // Check for a winner in all directions
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            let color = board_array[c][r];
            if (!color) continue;

            // Horizontal
            if (c <= cols - 4 &&
                color === board_array[c + 1][r] && 
                color === board_array[c + 2][r] && 
                color === board_array[c + 3][r]) {
                return color;
            }

            // Vertical
            if (r <= rows - 4 &&
                color === board_array[c][r + 1] && 
                color === board_array[c][r + 2] && 
                color === board_array[c][r + 3]) {
                return color;
            }

            // Diagonal Right
            if (c <= cols - 4 && r <= rows - 4 &&
                color === board_array[c + 1][r + 1] && 
                color === board_array[c + 2][r + 2] && 
                color === board_array[c + 3][r + 3]) {
                return color;
            }

            // Diagonal Left
            if (c >= 3 && r <= rows - 4 &&
                color === board_array[c - 1][r + 1] && 
                color === board_array[c - 2][r + 2] && 
                color === board_array[c - 3][r + 3]) {
                return color;
            }
        }
    }

    // Check for tie
    if (document.querySelectorAll('.circle').length === document.querySelectorAll('.circle[style*="background-color"]').length) {
        return 'tie';
    }

    return null;
}

function togglePlayer() {
    currentPlayer = (currentPlayer === 'red') ? 'yellow' : 'red';
    const playerSpan = document.querySelector('.current-player');
    playerSpan.textContent = currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1);
    playerSpan.style.color = currentPlayer;
}

document.getElementById('reset-button').addEventListener('click', function() {
    location.reload();
})