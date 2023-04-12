const timerText = document.getElementById("timer-text");
TimerControllerBridge.setTimerText();
const toggleTimerBtn = document.getElementById("start-stop-btn");

function activate() {
    TimerControllerBridge.start();
    toggleTimerBtn.innerText = "Stop";
}

function deactivate() {
    TimerControllerBridge.stop();
    toggleTimerBtn.innerText = "Start";
}

toggleTimerBtn.addEventListener("click", async () => {
    let isActive = await TimerControllerBridge.isActive();
    console.log(isActive);
    if (isActive) {
        deactivate();
    } else {
        activate();
    }
});