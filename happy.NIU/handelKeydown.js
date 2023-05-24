import * as index from '../index.js'
import slide from './slide.js';

import * as HS from './highScore.js'

//Yable: set delay time to let animation of merge and move go first, then create new squares.
//Otherwise, the generated new square will also move.
function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time)
    });
}

function handleKeydown(event) {
    // If the game is over and the 'r' key was pressed, restart the game
    if (index.shareGameOver.over) {
        index.gameStart();
        console.log('restart');
    } 
    //Yable edit: move out the && (event.key === 'r' || event.key === 'R') part and make it independent
    if (event.key === 'r' || event.key === 'R') {
        index.gameStart();
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
                // delay the slide until the animation is complete
                delay(200).then(function() {
                    slide();
                    console.log('slide complete')
                    });
            }
        }
        else if (event.key === 'ArrowUp') {
            console.log('U');
            //Yable: Detect if the move is an effective move
            if (isEffectiveMoveUp()) {
                moveUp();
                console.log('Move Up executed')
                delay(200).then(function() {
                    slide();
                    console.log('slide complete')
                    });
            }
        }
        else if (event.key === 'ArrowDown') {
            console.log('D');
            //Yable: Detect if the move is an effective move
            if (isEffectiveMoveDown()) {
                moveDown()
                console.log('Move Down executed')
                delay(200).then(function() {
                    slide();
                    console.log('slide complete')
                    });
            }
        }
        else if (event.key === 'ArrowRight') {
            console.log('R');
            //Yable: Detect if the move is an effective move
            if (isEffectiveMoveRight()) {
                moveRight();
                console.log('Move Right executed')
                delay(200).then(function() {
                    slide();
                    console.log('slide complete')
                    });
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

//The following comment contains the original logic without animation
// Yable: execute moving left. This involves both merge and move
// async function moveLeft() {
//     for (let row = 0; row < 4; row ++) {
//         for (let col = 0; col < 4; col++) {
//             const currentSquare = index.gameBox[row][col];
//             if (!currentSquare) continue;

//             let targetCol = col - 1;
//             while (targetCol >= 0 && !index.gameBox[row][targetCol]) {
//                 targetCol--;
//             }
//             if (targetCol >= 0 && index.gameBox[row][targetCol].value === currentSquare.value) {
//                 //merge squares
//                 index.gameBox[row][targetCol].value = index.gameBox[row][targetCol].value + currentSquare.value; // Update the value
//                 index.gameBox[row][targetCol].element.textContent = index.gameBox[row][targetCol].value; // Update the displayed value
//                 index.shareScore.score += index.gameBox[row][targetCol].value; // Add the value to the score
//                 document.getElementById("score_content").innerText = index.shareScore.score;
//                 // Remove the current square
//                 currentSquare.element.remove(); // Removes the element from the DOM
//                 index.gameBox[row][col] = null; // Removes the square from the gameBox
//                 console.log("Merged to left!!!", index.gameBox)
//             } else {
//                 //Move square
//                 targetCol++ // Adjust the target column to be the first empty cell
//                 if (targetCol !== col) {
//                     // Move the square to the target cell
//                 index.gameBox[row][targetCol] = currentSquare;
//                 index.gameBox[row][col] = null;  // Remove the square from the current cell
//                 currentSquare.col = targetCol;  // Update the square's column
//                 // Update the square's position in the DOM
//                 const widthBody = document.getElementById('body_content').offsetWidth;
//                 currentSquare.element.style.left = 0.24 * widthBody * currentSquare.col + "px";
//                 console.log("Moved to left!!!",index.gameBox)
//                 }
//             }
//         }
//     }
// }

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

                // 增加最高分的判断
                HS.ifHighScore(index.shareScore.score);
                index.highScoreText.innerHTML = HS.highScore;

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

                // 增加最高分的判断
                HS.ifHighScore(index.shareScore.score);
                index.highScoreText.innerHTML = HS.highScore;

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

// //Yable: execute moving up
// async function moveUp() {
//     for (let col = 0; col < 4; col++) {
//         for (let row = 0; row < 4; row ++) {
//             const currentSquare = index.gameBox[row][col];
//             if (!currentSquare) continue;

//             let targetRow = row - 1;
//             while (targetRow >= 0 && !index.gameBox[targetRow][col]) {
//                 targetRow--;
//             }
//             if (targetRow >= 0 && index.gameBox[targetRow][col].value === currentSquare.value) {
//                 //merge squares
//                 index.gameBox[targetRow][col].value = index.gameBox[targetRow][col].value + currentSquare.value;
//                 index.gameBox[targetRow][col].element.textContent = index.gameBox[targetRow][col].value;
//                 index.shareScore.score += index.gameBox[targetRow][col].value; // Add the value to the score
//                 document.getElementById("score_content").innerText = index.shareScore.score;
//                 currentSquare.element.remove();
//                 index.gameBox[row][col] = null;
//                 console.log("Merged upwards!!!", index.gameBox)
//             } else {
//                 //Move square
//                 targetRow++;
//                 if (targetRow !== row) {
//                     index.gameBox[targetRow][col] = currentSquare;
//                     index.gameBox[row][col] = null;
//                     currentSquare.row = targetRow;
//                     const heightBody = document.getElementById('body_content').offsetHeight;
//                     currentSquare.element.style.top = 0.24 * heightBody * currentSquare.row + "px";
//                     console.log("Moved upwards!!!", index.gameBox)
//                 }
//             }
//         }
//     }
// }

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

                // 增加最高分的判断
                HS.ifHighScore(index.shareScore.score);
                index.highScoreText.innerHTML = HS.highScore;

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

// //Yable: execute moving down
// async function moveDown() {
//     for (let col = 0; col < 4; col++) {
//         for (let row = 3; row >= 0; row--) {
//             const currentSquare = index.gameBox[row][col];
//             if (!currentSquare) continue;

//             let targetRow = row + 1;
//             while (targetRow < 4 && !index.gameBox[targetRow][col]) {
//                 targetRow++;
//             }
//             if (targetRow < 4 && index.gameBox[targetRow][col].value === currentSquare.value) {
//                 //merge squares
//                 index.gameBox[targetRow][col].value = index.gameBox[targetRow][col].value + currentSquare.value;
//                 index.gameBox[targetRow][col].element.textContent = index.gameBox[targetRow][col].value;
//                 index.shareScore.score += index.gameBox[targetRow][col].value; // Add the value to the score
//                 document.getElementById("score_content").innerText = index.shareScore.score;
//                 currentSquare.element.remove();
//                 index.gameBox[row][col] = null;
//                 console.log("Merged downwards!!!", index.gameBox)
//             } else {
//                 //Move square
//                 targetRow--;
//                 if (targetRow !== row) {
//                     index.gameBox[targetRow][col] = currentSquare;
//                     index.gameBox[row][col] = null;
//                     currentSquare.row = targetRow;
//                     const heightBody = document.getElementById('body_content').offsetHeight;
//                     currentSquare.element.style.top = 0.24 * heightBody * currentSquare.row + "px";
//                     console.log("Moved downwards!!!", index.gameBox)
//                 }
//             }
//         }
//     }
// }
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

                // 增加最高分的判断
                HS.ifHighScore(index.shareScore.score);
                index.highScoreText.innerHTML = HS.highScore;

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