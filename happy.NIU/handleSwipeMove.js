import * as index from '../index.js'
import slide from './slide.js';

let gameBoardElement = document.getElementById('body_content')
// Calculate the boundaries of the game board
let gameBoardRect = gameBoardElement.getBoundingClientRect();
let gameBoardStartX = gameBoardRect.left;
let gameBoardEndX = gameBoardRect.right;
let gameBoardStartY = gameBoardRect.top;
let gameBoardEndY = gameBoardRect.bottom;

function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time)
    });
}

let touchStartX;
let touchStartY;
let touchEndX;
let touchEndY;
const swipeThreshold = 30; // Threshold for swiping movements. Adjust this value as needed

function handleSwipeMove(event) {
    let touchX, touchY;
    if (event.type === 'touchstart' || event.type === 'touchmove') {
        touchX = event.touches[0].clientX;
        touchY = event.touches[0].clientY;
    } else if (event.type === 'touchend') {
        touchX = event.changedTouches[0].clientX;
        touchY = event.changedTouches[0].clientY;
    }

    // Check if the touch event occurred within the game board
    if (touchY < gameBoardStartY) {
        return; // Ignore swipe movements outside the game board
    }

    if (event.type === 'touchstart') {
        touchStartX = touchX;
        touchStartY = touchY;
    } else if (event.type === 'touchmove') {
        touchEndX = touchX;
        touchEndY = touchY;
    } else if (event.type === 'touchend') {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        if (absDeltaX < swipeThreshold && absDeltaY < swipeThreshold) {
            return; // Ignore slight movements
        } 

        if (absDeltaX > absDeltaY) {
            // Horizontal swipe
            if (deltaX > 0 && isEffectiveMoveRight()) {
                moveRight();
                console.log('Move Right executed');
                delay(300).then(function() {
                    slide();
                    console.log('slide complete');
                });
            } else if (deltaX < 0 && isEffectiveMoveLeft()) {
                moveLeft();
                console.log('Move Left executed');
                delay(300).then(function() {
                    slide();
                    console.log('slide complete');
                });
            }
        } else {
            // Vertical swipe
            if (deltaY > 0 && isEffectiveMoveDown()) {
                moveDown();
                console.log('Move Down executed');
                delay(300).then(function() {
                    slide();
                    console.log('slide complete');
                });
            } else if (deltaY < 0 && isEffectiveMoveUp()) {
                moveUp();
                console.log('Move Up executed');
                delay(300).then(function() {
                    slide();
                    console.log('slide complete');
                });
            }
        }
    }
}

async function moveLeft() {
    // Step 1: Perform all movements
    for (let row = 0; row < 4; row++) {
        for (let col = 1; col < 4; col++) {
            let currentSquare = index.gameBox[row][col];
            if (!currentSquare) continue;

            let targetCol = col - 1;
            while (targetCol >= 0 && !index.gameBox[row][targetCol]) {
                targetCol--;
            }
            targetCol++;

            if (targetCol !== col) {
                index.gameBox[row][targetCol] = currentSquare;
                index.gameBox[row][col] = null;
                currentSquare.col = targetCol;
                const widthBody = document.getElementById('body_content').offsetWidth;
                currentSquare.element.style.left = 0.24 * widthBody * currentSquare.col + "px";
            }
        }
    }
    await new Promise(resolve => setTimeout(resolve, 50));  // Wait for movements to complete

    // Step 2: Perform all merges
    for (let row = 0; row < 4; row++) {
        for (let col = 1; col < 4; col++) {
            let currentSquare = index.gameBox[row][col];
            if (!currentSquare) continue;

            let targetSquare = index.gameBox[row][col - 1];
            if (targetSquare && currentSquare.value === targetSquare.value) {
                index.gameBox[row][col - 1].value *= 2;
                index.gameBox[row][col - 1].element.textContent = index.gameBox[row][col - 1].value;
                index.shareScore.score += index.gameBox[row][col - 1].value;
                document.getElementById("score_content").innerText = index.shareScore.score;
                currentSquare.element.remove();
                index.gameBox[row][col] = null;

                // Add 'merged' class to target square
                targetSquare.element.classList.add('merged');
                
                            // Remove the 'merged' class after the animation has completed
                setTimeout(() => {
                targetSquare.element.classList.remove('merged');
                }, 50);  // The timeout duration should match the animation duration
            }
        }
    }
    await new Promise(resolve => setTimeout(resolve, 50));  // Wait for merges to complete

    // Step 3: Perform all movements again
    for (let row = 0; row < 4; row++) {
        for (let col = 1; col < 4; col++) {
            let currentSquare = index.gameBox[row][col];
            if (!currentSquare) continue;

            let targetCol = col - 1;
            while (targetCol >= 0 && !index.gameBox[row][targetCol]) {
                targetCol--;
            }
            targetCol++;

            if (targetCol !== col) {
                index.gameBox[row][targetCol] = currentSquare;
                index.gameBox[row][col] = null;
                currentSquare.col = targetCol;
                const widthBody = document.getElementById('body_content').offsetWidth;
                currentSquare.element.style.left = 0.24 * widthBody * currentSquare.col + "px";
            }
        }
    }
    await new Promise(resolve => setTimeout(resolve, 50));  // Wait for movements to complete
}

//Yable: detect whether a left movement is effective
function isEffectiveMoveLeft() {
    for (let row = 0; row < 4; row ++) {
        for (let col = 0; col < 4; col++) {
            const currentSquare = index.gameBox[row][col];
            if (!currentSquare) continue;

            let targetCol = col - 1;
            while (targetCol >= 0 && !index.gameBox[row][targetCol]) {
                targetCol--;
            }
            if (targetCol >= 0 && index.gameBox[row][targetCol].value === currentSquare.value) {
                // squares would merge
                return true;
            } else {
                targetCol++; // Adjust the target column to be the first empty cell
                if (targetCol !== col) {
                    // square would move
                    return true;
                }
            }
        }
    }
    return false; // no square would move or merge
}

async function moveRight() {
    // Step 1: Perform all movements
    for (let row = 0; row < 4; row++) {
        for (let col = 2; col >= 0; col--) {
            let currentSquare = index.gameBox[row][col];
            if (!currentSquare) continue;

            let targetCol = col + 1;
            while (targetCol < 4 && !index.gameBox[row][targetCol]) {
                targetCol++;
            }
            targetCol--;

            if (targetCol !== col) {
                index.gameBox[row][targetCol] = currentSquare;
                index.gameBox[row][col] = null;
                currentSquare.col = targetCol;
                const widthBody = document.getElementById('body_content').offsetWidth;
                currentSquare.element.style.left = 0.24 * widthBody * currentSquare.col + "px";
            }
        }
    }
    await new Promise(resolve => setTimeout(resolve, 50));  // Wait for movements to complete

    // Step 2: Perform all merges
    for (let row = 0; row < 4; row++) {
        for (let col = 2; col >= 0; col--) {
            let currentSquare = index.gameBox[row][col];
            if (!currentSquare) continue;

            let targetSquare = index.gameBox[row][col + 1];
            if (targetSquare && currentSquare.value === targetSquare.value) {
                index.gameBox[row][col + 1].value *= 2;
                index.gameBox[row][col + 1].element.textContent = index.gameBox[row][col + 1].value;
                index.shareScore.score += index.gameBox[row][col + 1].value;
                document.getElementById("score_content").innerText = index.shareScore.score;
                currentSquare.element.remove();
                index.gameBox[row][col] = null;

                // Add 'merged' class to target square
                targetSquare.element.classList.add('merged');
                
                // Remove the 'merged' class after the animation has completed
                setTimeout(() => {
                    targetSquare.element.classList.remove('merged');
                }, 50);  // The timeout duration should match the animation duration
            }
        }
    }
    await new Promise(resolve => setTimeout(resolve, 50));  // Wait for merges to complete

    // Step 3: Perform all movements again
    for (let row = 0; row < 4; row++) {
        for (let col = 2; col >= 0; col--) {
            let currentSquare = index.gameBox[row][col];
            if (!currentSquare) continue;

            let targetCol = col + 1;
            while (targetCol < 4 && !index.gameBox[row][targetCol]) {
                targetCol++;
            }
            targetCol--;

            if (targetCol !== col) {
                index.gameBox[row][targetCol] = currentSquare;
                index.gameBox[row][col] = null;
                currentSquare.col = targetCol;
                const widthBody = document.getElementById('body_content').offsetWidth;
                currentSquare.element.style.left = 0.24 * widthBody * currentSquare.col + "px";
            }
        }
    }
    await new Promise(resolve => setTimeout(resolve, 50));  // Wait for movements to complete
}
//Yable: detect if a right movement is effective
function isEffectiveMoveRight() {
    for (let row = 0; row < 4; row ++) {
        for (let col = 3; col >= 0; col--) {
            const currentSquare = index.gameBox[row][col];
            if (!currentSquare) continue;

            let targetCol = col + 1;
            while (targetCol < 4 && !index.gameBox[row][targetCol]) {
                targetCol++;
            }
            if (targetCol < 4 && index.gameBox[row][targetCol].value === currentSquare.value) {
                return true;
            } else {
                targetCol--;
                if (targetCol !== col) {
                    return true;
                }
            }
        }
    }
    return false;
}

async function moveUp() {
    // Step 1: Perform all movements
    for (let col = 0; col < 4; col++) {
        for (let row = 1; row < 4; row++) {
            let currentSquare = index.gameBox[row][col];
            if (!currentSquare) continue;

            let targetRow = row - 1;
            while (targetRow >= 0 && !index.gameBox[targetRow][col]) {
                targetRow--;
            }
            targetRow++;

            if (targetRow !== row) {
                index.gameBox[targetRow][col] = currentSquare;
                index.gameBox[row][col] = null;
                currentSquare.row = targetRow;
                const heightBody = document.getElementById('body_content').offsetHeight;
                currentSquare.element.style.top = 0.24 * heightBody * currentSquare.row + "px";
            }
        }
    }
    await new Promise(resolve => setTimeout(resolve, 50));  // Wait for movements to complete

    // Step 2: Perform all merges
    for (let col = 0; col < 4; col++) {
        for (let row = 1; row < 4; row++) {
            let currentSquare = index.gameBox[row][col];
            if (!currentSquare) continue;

            let targetSquare = index.gameBox[row - 1][col];
            if (targetSquare && currentSquare.value === targetSquare.value) {
                index.gameBox[row - 1][col].value *= 2;
                index.gameBox[row - 1][col].element.textContent = index.gameBox[row - 1][col].value;
                index.shareScore.score += index.gameBox[row - 1][col].value;
                document.getElementById("score_content").innerText = index.shareScore.score;
                currentSquare.element.remove();
                index.gameBox[row][col] = null;

                // Add 'merged' class to target square
                targetSquare.element.classList.add('merged');
                
                // Remove the 'merged' class after the animation has completed
                setTimeout(() => {
                    targetSquare.element.classList.remove('merged');
                }, 50);  // The timeout duration should match the animation duration
            }
        }
    }
    await new Promise(resolve => setTimeout(resolve, 50));  // Wait for merges to complete

    // Step 3: Perform all movements again
    for (let col = 0; col < 4; col++) {
        for (let row = 1; row < 4; row++) {
            let currentSquare = index.gameBox[row][col];
            if (!currentSquare) continue;

            let targetRow = row - 1;
            while (targetRow >= 0 && !index.gameBox[targetRow][col]) {
                targetRow--;
            }
            targetRow++;

            if (targetRow !== row) {
                index.gameBox[targetRow][col] = currentSquare;
                index.gameBox[row][col] = null;
                currentSquare.row = targetRow;
                const heightBody = document.getElementById('body_content').offsetHeight;
                currentSquare.element.style.top = 0.24 * heightBody * currentSquare.row + "px";
            }
        }
    }
    await new Promise(resolve => setTimeout(resolve, 50));  // Wait for movements to complete
}

//Yable: detect whether a up movement is effective
function isEffectiveMoveUp() {
    for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 4; row ++) {
            const currentSquare = index.gameBox[row][col];
            if (!currentSquare) continue;

            let targetRow = row - 1;
            while (targetRow >= 0 && !index.gameBox[targetRow][col]) {
                targetRow--;
            }
            if (targetRow >= 0 && index.gameBox[targetRow][col].value === currentSquare.value) {
                return true;
            } else {
                targetRow++;
                if (targetRow !== row) {
                    return true;
                }
            }
        }
    }
    return false;
}
async function moveDown() {
    // Step 1: Perform all movements
    for (let col = 0; col < 4; col++) {
        for (let row = 2; row >= 0; row--) {
            let currentSquare = index.gameBox[row][col];
            if (!currentSquare) continue;

            let targetRow = row + 1;
            while (targetRow < 4 && !index.gameBox[targetRow][col]) {
                targetRow++;
            }
            targetRow--;

            if (targetRow !== row) {
                index.gameBox[targetRow][col] = currentSquare;
                index.gameBox[row][col] = null;
                currentSquare.row = targetRow;
                const heightBody = document.getElementById('body_content').offsetHeight;
                currentSquare.element.style.top = 0.24 * heightBody * currentSquare.row + "px";
            }
        }
    }
    await new Promise(resolve => setTimeout(resolve, 50));  // Wait for movements to complete

    // Step 2: Perform all merges
    for (let col = 0; col < 4; col++) {
        for (let row = 2; row >= 0; row--) {
            let currentSquare = index.gameBox[row][col];
            if (!currentSquare) continue;

            let targetSquare = index.gameBox[row + 1][col];
            if (targetSquare && currentSquare.value === targetSquare.value) {
                index.gameBox[row + 1][col].value *= 2;
                index.gameBox[row + 1][col].element.textContent = index.gameBox[row + 1][col].value;
                index.shareScore.score += index.gameBox[row + 1][col].value;
                document.getElementById("score_content").innerText = index.shareScore.score;
                currentSquare.element.remove();
                index.gameBox[row][col] = null;

                // Add 'merged' class to target square
                targetSquare.element.classList.add('merged');
                
                // Remove the 'merged' class after the animation has completed
                setTimeout(() => {
                    targetSquare.element.classList.remove('merged');
                }, 50);  // The timeout duration should match the animation duration
            }
        }
    }
    await new Promise(resolve => setTimeout(resolve, 50));  // Wait for merges to complete

    // Step 3: Perform all movements again
    for (let col = 0; col < 4; col++) {
        for (let row = 2; row >= 0; row--) {
            let currentSquare = index.gameBox[row][col];
            if (!currentSquare) continue;

            let targetRow = row + 1;
            while (targetRow < 4 && !index.gameBox[targetRow][col]) {
                targetRow++;
            }
            targetRow--;

            if (targetRow !== row) {
                index.gameBox[targetRow][col] = currentSquare;
                index.gameBox[row][col] = null;
                currentSquare.row = targetRow;
                const heightBody = document.getElementById('body_content').offsetHeight;
                currentSquare.element.style.top = 0.24 * heightBody * currentSquare.row + "px";
            }
        }
    }
    await new Promise(resolve => setTimeout(resolve, 50));  // Wait for movements to complete
}

//Yable: detect whether a down movement is effective
export function isEffectiveMoveDown() {
    for (let col = 0; col < 4; col++) {
        for (let row = 3; row >= 0; row--) {
            const currentSquare = index.gameBox[row][col];
            if (!currentSquare) continue;

            let targetRow = row + 1;
            while (targetRow < 4 && !index.gameBox[targetRow][col]) {
                targetRow++;
            }
            if (targetRow < 4 && index.gameBox[targetRow][col].value === currentSquare.value) {
                return true;
            } else {
                targetRow--;
                if (targetRow !== row) {
                    return true;
                }
            }
        }
    }
    return false;
}

export default handleSwipeMove;