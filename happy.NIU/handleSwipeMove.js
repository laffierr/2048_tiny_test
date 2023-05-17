import * as index from '../index.js'
// import { gameBox,shareScore } from './index.js';
import slide from './slide.js';


let touchStartX;
let touchStartY;
let touchEndX;
let touchEndY;
const swipeThreshold = 30; // Threshold for swiping movements. Adjust this value as needed

function handleSwipeMove(event) {
    if (event.type === 'touchstart') {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    } else if (event.type === 'touchmove') {
        touchEndX = event.changedTouches[0].clientX;
        touchEndY = event.changedTouches[0].clientY;
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
            if (deltaX > 0) {
                // Swipe to the right
                if (isEffectiveMoveRight()) {
                    moveRight();
                    console.log('Swipe right executed')
                    slide();
                }
            } else {
                // Swipe to the left
                if (isEffectiveMoveLeft()) {
                    moveLeft();
                    console.log('Swipe left executed')
                    slide();
                }
            }
        } else {
            // Vertical swipe
            if (deltaY > 0) {
                // Swipe down
                if (isEffectiveMoveDown()) {
                    moveDown();
                    console.log('Swipe down executed')
                    slide();
                }
            } else {
                // Swipe up
                if (isEffectiveMoveUp()) {
                    moveUp();
                    console.log('Swipe up executed')
                    slide();
                }
            }
        }
    }
}


//Yable: execute moving left. This involves both merge and move
async function moveLeft() {
    for (let row = 0; row < 4; row ++) {
        for (let col = 0; col < 4; col++) {
            const currentSquare = index.gameBox[row][col];
            if (!currentSquare) continue;

            let targetCol = col - 1;
            while (targetCol >= 0 && !index.gameBox[row][targetCol]) {
                targetCol--;
            }
            if (targetCol >= 0 && index.gameBox[row][targetCol].value === currentSquare.value) {
                //merge squares
                index.gameBox[row][targetCol].value = index.gameBox[row][targetCol].value + currentSquare.value; // Update the value
                index.gameBox[row][targetCol].element.textContent = index.gameBox[row][targetCol].value; // Update the displayed value
                index.shareScore.score += index.gameBox[row][targetCol].value; // Add the value to the score
                document.getElementById("score_content").innerText = index.shareScore.score;
                // Remove the current square
                currentSquare.element.remove(); // Removes the element from the DOM
                index.gameBox[row][col] = null; // Removes the square from the gameBox
                console.log("Merged to left!!!", index.gameBox)
            } else {
                //Move square
                targetCol++ // Adjust the target column to be the first empty cell
                if (targetCol !== col) {
                    // Move the square to the target cell
                index.gameBox[row][targetCol] = currentSquare;
                index.gameBox[row][col] = null;  // Remove the square from the current cell
                currentSquare.col = targetCol;  // Update the square's column
                // Update the square's position in the DOM
                const widthBody = document.getElementById('body_content').offsetWidth;
                currentSquare.element.style.left = 0.24 * widthBody * currentSquare.col + "px";
                console.log("Moved to left!!!",index.gameBox)
                }
            }
        }
    }
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

//Yable: execute moving right
async function moveRight() {
    for (let row = 0; row < 4; row ++) {
        for (let col = 3; col >= 0; col--) {
            const currentSquare = index.gameBox[row][col];
            if (!currentSquare) continue;

            let targetCol = col + 1;
            while (targetCol < 4 && !index.gameBox[row][targetCol]) {
                targetCol++;
            }
            if (targetCol < 4 && index.gameBox[row][targetCol].value === currentSquare.value) {
                //merge squares
                index.gameBox[row][targetCol].value = index.gameBox[row][targetCol].value + currentSquare.value;
                index.gameBox[row][targetCol].element.textContent = index.gameBox[row][targetCol].value;
                index.shareScore.score += index.gameBox[row][targetCol].value; // Add the value to the score
                document.getElementById("score_content").innerText = index.shareScore.score;
                currentSquare.element.remove();
                index.gameBox[row][col] = null;
                console.log("Merged to right!!!", index.gameBox)
            } else {
                //Move square
                targetCol--;
                if (targetCol !== col) {
                    index.gameBox[row][targetCol] = currentSquare;
                    index.gameBox[row][col] = null;
                    currentSquare.col = targetCol;
                    const widthBody = document.getElementById('body_content').offsetWidth;
                    currentSquare.element.style.left = 0.24 * widthBody * currentSquare.col + "px";
                    console.log("Moved to right!!!", index.gameBox)
                }
            }
        }
    }
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

//Yable: execute moving up
async function moveUp() {
    for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 4; row ++) {
            const currentSquare = index.gameBox[row][col];
            if (!currentSquare) continue;

            let targetRow = row - 1;
            while (targetRow >= 0 && !index.gameBox[targetRow][col]) {
                targetRow--;
            }
            if (targetRow >= 0 && index.gameBox[targetRow][col].value === currentSquare.value) {
                //merge squares
                index.gameBox[targetRow][col].value = index.gameBox[targetRow][col].value + currentSquare.value;
                index.gameBox[targetRow][col].element.textContent = index.gameBox[targetRow][col].value;
                index.shareScore.score += index.gameBox[targetRow][col].value; // Add the value to the score
                document.getElementById("score_content").innerText = index.shareScore.score;
                currentSquare.element.remove();
                index.gameBox[row][col] = null;
                console.log("Merged upwards!!!", index.gameBox)
            } else {
                //Move square
                targetRow++;
                if (targetRow !== row) {
                    index.gameBox[targetRow][col] = currentSquare;
                    index.gameBox[row][col] = null;
                    currentSquare.row = targetRow;
                    const heightBody = document.getElementById('body_content').offsetHeight;
                    currentSquare.element.style.top = 0.24 * heightBody * currentSquare.row + "px";
                    console.log("Moved upwards!!!", index.gameBox)
                }
            }
        }
    }
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

//Yable: execute moving down
async function moveDown() {
    for (let col = 0; col < 4; col++) {
        for (let row = 3; row >= 0; row--) {
            const currentSquare = index.gameBox[row][col];
            if (!currentSquare) continue;

            let targetRow = row + 1;
            while (targetRow < 4 && !index.gameBox[targetRow][col]) {
                targetRow++;
            }
            if (targetRow < 4 && index.gameBox[targetRow][col].value === currentSquare.value) {
                //merge squares
                index.gameBox[targetRow][col].value = index.gameBox[targetRow][col].value + currentSquare.value;
                index.gameBox[targetRow][col].element.textContent = index.gameBox[targetRow][col].value;
                index.shareScore.score += index.gameBox[targetRow][col].value; // Add the value to the score
                document.getElementById("score_content").innerText = index.shareScore.score;
                currentSquare.element.remove();
                index.gameBox[row][col] = null;
                console.log("Merged downwards!!!", index.gameBox)
            } else {
                //Move square
                targetRow--;
                if (targetRow !== row) {
                    index.gameBox[targetRow][col] = currentSquare;
                    index.gameBox[row][col] = null;
                    currentSquare.row = targetRow;
                    const heightBody = document.getElementById('body_content').offsetHeight;
                    currentSquare.element.style.top = 0.24 * heightBody * currentSquare.row + "px";
                    console.log("Moved downwards!!!", index.gameBox)
                }
            }
        }
    }
}

//Yable: detect whether a down movement is effective
function isEffectiveMoveDown() {
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