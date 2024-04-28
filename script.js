let sidebarOpen = false;

// Function to get the height of an element by selector
function getElementHeight(selector) {
    const element = document.querySelector(selector);
    return element ? element.offsetHeight : 0;
}

// Function to adjust sidebar height based on header and footer
function adjustSidebar() {
    const headerHeight = getElementHeight('header');
    const footerHeight = getElementHeight('footer');
    const sidebar = document.getElementById('mySidebar');
    sidebar.style.top = headerHeight + 'px';
    sidebar.style.height = `calc(100vh - ${headerHeight + footerHeight}px)`;
}

// Function to adjust game container padding-bottom based on footer height
function adjustGameContainerPadding() {
    const footerHeight = getElementHeight('footer');
    const gameContainer = document.querySelector('.game-container');
    gameContainer.style.paddingBottom = `${footerHeight}px`;
}

// Function to toggle sidebar visibility
function toggleNav() {
    adjustSidebar();  // Ensure sidebar dimensions are adjusted before toggling
    const sidebarWidth = sidebarOpen ? '0' : '150px';  // Toggle width between 0 and 150px
    document.getElementById("mySidebar").style.width = sidebarWidth;
    sidebarOpen = !sidebarOpen;  // Toggle the state
}

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', function () {
    adjustSidebar();  // Initial sidebar adjustment
    adjustGameContainerPadding();  // Initial padding adjustment
});
