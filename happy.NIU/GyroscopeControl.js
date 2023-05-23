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