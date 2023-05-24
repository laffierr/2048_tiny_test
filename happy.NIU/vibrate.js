export default function vibrate() {
    if ("vibrate" in navigator) {
        // Vibration API supported
        navigator.vibrate(200);
        console.log("vibrated")
    } else {
        // Vibration API not supported
        console.log("Vibration API is not supported in this browser.");
    }
}