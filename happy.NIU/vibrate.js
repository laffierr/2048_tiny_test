export default function vibrate() {
    if (navigator.vibrate) {
        navigator.vibrate(200);
    }
}