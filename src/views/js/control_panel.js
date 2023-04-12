const timerText = document.getElementById("timer-text");
const toggleTimerBtn = document.getElementById("start-stop-btn");
const optionsBtn = document.getElementById("options-btn");
const statsBtn = document.getElementById("stats-btn");

TimerControllerBridge.setTimerText();

function disableButtons() {
    optionsBtn.disabled = true;
    statsBtn.disabled = true;
}

function enableButtons() {
    optionsBtn.disabled = false;
    statsBtn.disabled = false;
}

function toggleStartStopBtnText() {
    if (toggleTimerBtn.innerText === "Start") {
        toggleTimerBtn.innerText = "Stop";
    } else {
        toggleTimerBtn.innerText = "Start";
    }
}

function activate() {
    disableButtons();
    TimerControllerBridge.start();
}

function deactivate() {
    enableButtons();
    TimerControllerBridge.stop();
}

toggleTimerBtn.addEventListener("click", async () => {
    let isActive = await TimerControllerBridge.isActive();
    if (isActive) {
        deactivate();
    } else {
        activate();
    }
    toggleStartStopBtnText();
});