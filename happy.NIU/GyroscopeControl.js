import * as index from '../index.js'
// import { gameBox,shareScore } from './index.js';
import slide from './slide.js';
import vibrate from './vibrate.js'

//Ask browser for gyroscope permission
export function requestOrientationPermission() {
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
          .then(permissionState => {
              if (permissionState === 'granted') {
                  window.addEventListener('deviceorientation', handleOrientation);
              } else {
                  console.log('Permission not granted.');
                  isGyroscopeEnabled = false;
                  gyroStatus.textContent = "Disabled";
              }
          })
          .catch(console.error);
  } else {
      // handle regular non iOS 13+ devices
      window.addEventListener('deviceorientation', handleOrientation);
  }
}

let previousGamma = 0;
let previousBeta = 0;
let previousTime = Date.now();
let coolDown = false;  // Variable to hold the cool-down state

export function handleOrientation(event) {
    if (coolDown) return;  // If in cool-down period, ignore the event

    var currentGamma = event.gamma;
    var currentBeta = event.beta;
    var currentTime = Date.now();

    var deltaGamma = currentGamma - previousGamma;
    var deltaBeta = currentBeta - previousBeta;
    var deltaTime = currentTime - previousTime; // in ms

    var gammaSpeed = deltaGamma / deltaTime * 1000; // in degrees per second
    var betaSpeed = deltaBeta / deltaTime * 1000; // in degrees per second

    var speedThreshold = 200; // adjust as needed
    // According to our impirical experience, moving down is usually harder

    if (Math.abs(gammaSpeed) > Math.abs(betaSpeed)) {
        // Gamma speed is greater: horizontal movement
        if (gammaSpeed > speedThreshold) {
            if (isEffectiveMoveRight()) {
                moveRight();
                console.log('Move Right executed');
                vibrate()
                coolDown = true;  // Set the cool-down state
                delay(300).then(function() {
                    slide();
                    console.log('slide complete');
                    delay(150).then(function() {  // Wait 500ms (or another suitable duration) before clearing the cool-down state
                        coolDown = false;
                    });
                });
            }
        } else if (gammaSpeed < -speedThreshold) {
            if (isEffectiveMoveLeft()) {
                moveLeft();
                console.log('Move Left executed');
                vibrate()
                coolDown = true;  // Set the cool-down state
                delay(300).then(function() {
                    slide();
                    console.log('slide complete');
                    delay(150).then(function() {
                        coolDown = false;
                    });
                });
            }
        }
    } else {
        // Beta speed is greater: vertical movement
        if (betaSpeed > speedThreshold) {
            if (isEffectiveMoveDown()) {
                moveDown();
                console.log('Move Down executed');
                vibrate()
                coolDown = true;  // Set the cool-down state
                delay(300).then(function() {
                    slide();
                    console.log('slide complete');
                    delay(150).then(function() {
                        coolDown = false;
                    });
                });
            }
        } else if (betaSpeed < -speedThreshold) {
            if (isEffectiveMoveUp()) {
                moveUp();
                console.log('Move Up executed');
                vibrate()
                coolDown = true;  // Set the cool-down state
                delay(300).then(function() {
                    slide();
                    console.log('slide complete');
                    delay(150).then(function() {
                        coolDown = false;
                    });
                });
            }
        }
    }

    // save the current orientation and time for the next event
    previousGamma = currentGamma;
    previousBeta = currentBeta;
    previousTime = currentTime;
}

function delay(time) {
  return new Promise(function(resolve) {
      setTimeout(resolve, time)
  });
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
