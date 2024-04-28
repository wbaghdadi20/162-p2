// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', function () {
    createBoard(6, 7);
});

function createBoard(rows, cols) {
    const board = document.querySelector('.board');
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            const circle = document.createElement('div');
            circle.className = 'circle';
            // Append the circle to the cell
            cell.appendChild(circle);
            // Append the cell to the board
            board.appendChild(cell);
        }
    }
}