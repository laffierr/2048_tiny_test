export default function handleOrientation(event) {
    var beta = event.beta;
    var gamma = event.gamma;

    // set some threshold for recognizing the action
    var threshold = 10;
    // Map the device orientation to game controls
  if (gamma > threshold) {
    // move right
    moveRight();
  } else if (gamma < -threshold) {
    // move left
    moveLeft();
  } else if (beta > threshold) {
    // move down
    moveDown();
  } else if (beta < -threshold) {
    // move up
    moveUp();
  }

}