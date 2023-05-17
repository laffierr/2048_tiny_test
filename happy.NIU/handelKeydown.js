import * as index from '../index.js'
// import { gameBox,shareScore } from './index.js';
import slide from './slide.js';


function handleKeydown(event) {
    // If the game is over and the 'r' key was pressed, restart the game
    if (index.shareGameOver.over) {
        gameStart();
        console.log('restart');
    } 
    //Yable edit: move out the && (event.key === 'r' || event.key === 'R') part and make it independent
    if (event.key === 'r' || event.key === 'R') {
        gameStart();
        console.log('restart');
    }
    else {
        // Handle other key presses
        //Yable: Now maybe there is no need to have a ifslide boolean value
        //since we will detect whether the move is effective every time an event happens.
        
        //yable edit:
        //let ifslide = true;
        if (event.key === 'ArrowLeft') {
            console.log('L');
            //Yable: Detect if the move is an effective move
            if (isEffectiveMoveLeft()) {
                moveLeft();
                console.log('Move Left executed')
                slide();
            }
        }
        else if (event.key === 'ArrowUp') {
            console.log('U');
            //Yable: Detect if the move is an effective move
            if (isEffectiveMoveUp()) {
                moveUp();
                console.log('Move Up executed')
                slide();
            }
        }
        else if (event.key === 'ArrowDown') {
            console.log('D');
            //Yable: Detect if the move is an effective move
            if (isEffectiveMoveDown()) {
                moveDown();
                console.log('Move Down executed')
                slide();
            }
        }
        else if (event.key === 'ArrowRight') {
            console.log('R');
            //Yable: Detect if the move is an effective move
            if (isEffectiveMoveRight()) {
                moveRight();
                console.log('Move Right executed')
                slide();
            }
        }

        //Yable edit:
        /*else {
            ifslide = false;
        }*/

        /*if (ifslide) {
            slide();
        }*/
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
                currentSquare.element.style.left = 120 * currentSquare.col + "px";
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
                    currentSquare.element.style.left = 120 * currentSquare.col + "px";
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
                    currentSquare.element.style.top = 120 * currentSquare.row + "px";
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
                    currentSquare.element.style.top = 120 * currentSquare.row + "px";
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



export default handleKeydown;