// Function to get the height of an element by selector
function getElementHeight(selector) {
    const element = document.querySelector(selector);
    return element ? element.offsetHeight : 0;
}

// Function to adjust game container padding-bottom based on footer height
function adjustGameContainerPadding() {
    const footerHeight = getElementHeight('footer');
    const gameContainer = document.querySelector('.game-container');
    gameContainer.style.paddingBottom = `${footerHeight}px`;
}

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', function () {
    adjustGameContainerPadding();  // Initial padding adjustment
});

document.getElementById('reset-button').addEventListener('click', function() {
    location.reload();
})