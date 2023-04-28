const toggleTimerBtn = document.getElementById("toggle-timer-btn");
const toggleBtnText = document.getElementById("toggle-btn-text");
const skipBreakBtn = document.getElementById("skip-break-btn");

const decrementBtn = document.getElementById("decrement-btn");
const nextBreakInput = document.getElementById("next-break-input");
const incrementBtn = document.getElementById("increment-btn");

let postponeBy = 1;
nextBreakInput.value = postponeBy;

function toggleTimerText() {
    if (toggleBtnText.innerHTML === "Start Break") {
        toggleBtnText.innerHTML = "Pause Break";
    } else {
        toggleBtnText.innerHTML = "Start Break";
    }
}

function activate() {
    skipBreakBtn.disabled = true;
    toggleTimerText();
    const minimizeMainWindow = false;
    TimerControllerBridge.startTimer(minimizeMainWindow);
}

function deactivate() {
    skipBreakBtn.disabled = false;
    toggleTimerText();
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

