const toggleTimerBtn = document.getElementById("toggle-timer-btn");
const skipBreakBtn = document.getElementById("skip-break-btn");

const decrementBtn = document.getElementById("decrement-btn");
const nextBreakInput = document.getElementById("next-break-input");
const incrementBtn = document.getElementById("increment-btn");

let postponeBy = 1;
nextBreakInput.value = postponeBy;

function activate() {
    skipBreakBtn.disabled = false;
    toggleTimerBtn.innerText = "Stop";
    const minimizeMainWindow = false;
    TimerControllerBridge.startTimer(false);
}

function deactivate() {
    skipBreakBtn.disabled = true;
    toggleTimerBtn.innerText = "Start";
    TimerControllerBridge.stopTimer();
}

toggleTimerBtn.addEventListener("click", async () => {
    const isActive = await TimerControllerBridge.isActive();
    if (!isActive) {
        activate();
    } else {
        deactivate();
    }
});

skipBreakBtn.addEventListener("click", () => {
    TimerControllerBridge.skipBreak(postponeBy);
});

incrementBtn.addEventListener("click", () => {
    postponeBy++;
    nextBreakInput.value = postponeBy;
});

decrementBtn.addEventListener("click", () => {
    postponeBy--;
    if (postponeBy < 1) {
        postponeBy = 1;
    }
    nextBreakInput.value = postponeBy;
});

nextBreakInput.addEventListener("change", () => {
    const value = parseInt(nextBreakInput.value);
    if (isNaN(value)) {
        nextBreakInput.value = postponeBy;
        return;
    } else if (value < 1) {
        nextBreakInput.value = postponeBy;
        return;
    }
    postponeBy = value;
});

