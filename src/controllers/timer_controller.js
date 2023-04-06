const timerText = document.getElementById("timer-text");
TimerController.timeRemainingMMSS()
    .then((timeRemaining) => {
        timerText.innerText = timeRemaining;
    });
const toggleTimerBtn = document.getElementById("start-stop-btn");

function activate() {
    TimerController.start();
    toggleTimerBtn.innerText = "Stop";
}

function deactivate() {
    TimerController.stop();
    toggleTimerBtn.innerText = "Start";
}

toggleTimerBtn.addEventListener("click", async () => {
    if (await TimerController.isActive()) {
        deactivate();
    } else {
        activate();
    }
});

