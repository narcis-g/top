const container = document.getElementById('container');
const resetButton = document.getElementById('reset-button');

function createGrid(squaresPerSide) {
    // Clear the existing grid
    container.innerHTML = '';

    const squareSize = 512 / squaresPerSide;

    for (let i = 0; i < squaresPerSide * squaresPerSide; i++) {
        const square = document.createElement('div');
        square.classList.add('grid-square');
        square.style.width = `${squareSize}px`;
        square.style.height = `${squareSize}px`;
        square.addEventListener('mouseover', () => {
            square.style.backgroundColor = 'black';
        });
        container.appendChild(square);
    }
}

resetButton.addEventListener('click', () => {
    let newSize = prompt('Enter the number of squares per side (1-100):');
    newSize = parseInt(newSize);

    if (newSize > 0 && newSize <= 100) {
        createGrid(newSize);
    } else {
        alert('Please enter a number between 1 and 100.');
    }
});

// Initial grid creation
createGrid(16);