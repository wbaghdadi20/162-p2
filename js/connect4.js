document.addEventListener('DOMContentLoaded', function() {
    createBoard(6, 7);
    initializeGame();
});

let currentPlayer = 'red'; // Start with player 'red'
let gameActive = true;

function createBoard(rows, cols) {
    const board = document.querySelector('.board');
    board.innerHTML = ''; // Clear existing board

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
}

function handleColumnClick(colIndex) {
    if (!gameActive) return;

    const columns = document.querySelectorAll('.column');
    const circles = Array.from(columns[colIndex].children).reverse();  // Get all circles in the column, reversed
    for (let circle of circles) {
        if (!circle.style.backgroundColor) { // Check if the circle is not yet filled
            circle.style.backgroundColor = currentPlayer; // Set the player's color
            let winner = checkWinner();
            if (winner) {
                if (winner === 'tie') {
                    // alert("It's a tie!");
                } else {
                    // alert(winner + ' wins!');
                }
                gameActive = false;
                columns.forEach(col => {
                    col.style.cursor = "default";
                })
                return;
            }
            togglePlayer(); // Switch to the other player
            break;
        }
    }
}

function checkWinner() {
    const rows = 6;
    const cols = 7;
    const board = [];
    
    // Build a 2D array from the current state of the board
    for (let c = 0; c < cols; c++) {
        const column = document.querySelectorAll('.column')[c].children;
        board[c] = [];
        for (let r = 0; r < rows; r++) {
            board[c][r] = column[r].style.backgroundColor;
        }
    }

    // Check for a winner in all directions
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            let color = board[c][r];
            if (!color) continue;

            // Horizontal
            if (c <= cols - 4 &&
                color === board[c + 1][r] && 
                color === board[c + 2][r] && 
                color === board[c + 3][r]) {
                return color;
            }

            // Vertical
            if (r <= rows - 4 &&
                color === board[c][r + 1] && 
                color === board[c][r + 2] && 
                color === board[c][r + 3]) {
                return color;
            }

            // Diagonal Right
            if (c <= cols - 4 && r <= rows - 4 &&
                color === board[c + 1][r + 1] && 
                color === board[c + 2][r + 2] && 
                color === board[c + 3][r + 3]) {
                return color;
            }

            // Diagonal Left
            if (c >= 3 && r <= rows - 4 &&
                color === board[c - 1][r + 1] && 
                color === board[c - 2][r + 2] && 
                color === board[c - 3][r + 3]) {
                return color;
            }
        }
    }

    // Check for tie
    if (document.querySelectorAll('.circle').length === document.querySelectorAll('.circle[style*="background-color"]').length) {
        return 'tie';
    }

    return null; // No winner or tie yet
}

function togglePlayer() {
    currentPlayer = (currentPlayer === 'red') ? 'yellow' : 'red';
}