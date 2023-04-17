const timerText = document.getElementById("timer-text");
const toggleTimerBtn = document.getElementById("start-stop-btn");
const optionsBtn = document.getElementById("options-btn");
const statsBtn = document.getElementById("stats-btn");

TimerControllerBridge.renderTimerText();

TimerControllerBridge.isActive()
    .then((isActive) => {
        if (isActive) {
            disableButtons();
            toggleStartStopBtnText();
        }
    });


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
    TimerControllerBridge.startTimer();
}

function deactivate() {
    enableButtons();
    TimerControllerBridge.stopTimer();
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