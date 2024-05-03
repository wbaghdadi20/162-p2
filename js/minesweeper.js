let board = document.querySelector('.minesweeper-board');
let isGameOver = false;
let remainingCells = 0;

const difficultySettings = {
    easy: { rows: 9, cols: 9, mines: 10},
    medium: { rows: 16, cols: 16, mines: 40 },
    hard: { rows: 16, cols: 30, mines: 99 },
    extreme: { rows: 30, cols: 30, mines: 270 }
};

const numberColors = new Map([
    [1, 'blue'],
    [2, 'green'],
    [3, 'red'],
    [4, 'violet'],
    [5, 'brown'],
    [6, '#333333'],
    [7, '#555555'],
    [8, '#888888']
]);

document.addEventListener('DOMContentLoaded', function() {
    // Select difficulty buttons and flag button
    const difficultyButtons = document.querySelectorAll('.difficulty-button');
    let flagState = 'red-flag';

    difficultyButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (isGameOver) {
                isGameOver = false;
            }
            const difficulty = this.textContent.toLowerCase();
            const settings = difficultySettings[difficulty];
            createBoard(settings.rows, settings.cols);
            setBoardDimensions(settings.rows, settings.cols);
            addMines(settings.rows, settings.cols, settings.mines);
            updateCellClickHandlers(flagState);
            calculateNeighborMines(settings.rows, settings.cols);
        });
    });

    const flagButton = document.querySelector('.flag-button img');
    flagButton.addEventListener('click', function() {
        flagState = (flagState === 'red-flag') ? 'green-flag' : 'red-flag';
        updateFlag(flagButton, flagState);
        updateCellClickHandlers(flagState);
    });
});

function createBoard(rows, cols) {
    board.innerHTML = '';
    remainingCells = rows * cols;

    for (let c = 0; c < cols; c++) {
        const column = document.createElement('div');
        column.classList.add('column');
        for (let r = 0; r < rows; r++) {
            const cell = document.createElement('div');
            cell.classList.add('cell', 'invisible');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', revealCell);
            column.appendChild(cell);
        }
        board.appendChild(column);
    }
}

function setBoardDimensions(rows, cols) {
    const cellSize = 30;
    const cellMargin = 2;

    const boardWidth = cols * (cellSize + cellMargin);
    const boardHeight = rows * (cellSize + cellMargin);

    board.style.setProperty('--board-width', `${boardWidth}px`);
    board.style.setProperty('--board-height', `${boardHeight}px`);
    board.style.setProperty('padding', `${cellMargin}px`);
    board.style.setProperty('border', '5px solid #808080');
}

function addMines(rows, cols, mines) {
    const cells = document.querySelectorAll('.minesweeper-board .column .cell');
    let indexes = Array.from({length: rows * cols}, (_, i) => i);
    shuffleArray(indexes);

    for (let i = 0; i < mines; i++) {
        cells[indexes[i]].classList.add('mine');
    }
}

function updateFlag(flagButton, flagState) {
    flagButton.src = `${flagState}.png`;
}

function updateCellClickHandlers(flagState) {
    const cells = document.querySelectorAll('.minesweeper-board .column .cell');
    cells.forEach(cell => {
        cell.removeEventListener('click', revealCell);
        cell.removeEventListener('click', placeFlag);
        cell.addEventListener('click', flagState === 'red-flag' ? revealCell : placeFlag);
    });
}

function revealCell() {
    // Avoid action if already visible, flagged, or game over
    if (this.classList.contains('visible') || this.classList.contains('flagged') || isGameOver) {
        return;
    }

    this.classList.replace('invisible', 'visible');

    if (this.classList.contains('mine')) {
        gameOver();
    } else {
        remainingCells--;
        this.id = 'visible'; // Add the ID 'visible' to the cell
        if (remainingCells === 0) {
            winGame();
        }
        const row = parseInt(this.dataset.row);
        const col = parseInt(this.dataset.col);
        const minesCount = countMines(row, col);
        if (minesCount > 0) {
            const numberText = document.createElement('div');
            numberText.classList.add('number-text');
            numberText.textContent = minesCount;
            numberText.style.color = numberColors.get(minesCount);
            this.appendChild(numberText);
        } else {
            revealNeighboringCells(row, col);
        }
    }
    checkWinCondition();
}

function countMines(row, col) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const neighbor = document.querySelector(`.cell[data-row="${row + dr}"][data-col="${col + dc}"]`);
            if (neighbor && neighbor.classList.contains('mine')) {
                count++;
            }
        }
    }
    return count;
}

function calculateNeighborMines(rows, cols) {
    const cells = document.querySelectorAll('.minesweeper-board .column .cell:not(.mine)');
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const minesCount = countMines(row, col);
        cell.dataset.minesCount = minesCount;
    });
}

function revealNeighboringCells(row, col) {
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            const neighbor = document.querySelector(`.cell[data-row="${row + dr}"][data-col="${col + dc}"]`);
            if (neighbor && !neighbor.classList.contains('visible')) {
                neighbor.click();
            }
        }
    }
}

function placeFlag() {
    if (!this.classList.contains('visible')) {
        this.classList.toggle('flagged');
    }
}

function gameOver() {
    isGameOver = true;
    const cells = document.querySelectorAll('.minesweeper-board .cell');
    cells.forEach(cell => {
        if (cell.classList.contains('mine')) {
            cell.classList.add('visible');
            cell.innerHTML = '&#128163;'; // Bomb icon
        }
    });
    alert('Game Over. Better luck next time!');
}

function winGame() {
    isGameOver = true;
    alert('Congratulations! You Won!');
}

function checkWinCondition() {
    const cells = document.querySelectorAll('.minesweeper-board .cell');
    let visibleCells = 0;

    cells.forEach(cell => {
        if (cell.classList.contains('visible') && !cell.classList.contains('mine')) {
            visibleCells++;
        }
    });

    const totalCells = cells.length;
    const totalMines = document.querySelectorAll('.minesweeper-board .mine').length;

    if (visibleCells === totalCells - totalMines) {
        winGame();
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

document.getElementById('reset-button').addEventListener('click', resetGame);

function resetGame() {
    location.reload();
}
