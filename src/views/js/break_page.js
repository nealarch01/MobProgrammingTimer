const timerText = document.getElementById("timer-text");
const endBreakBtn = document.getElementById("end-break-btn");
const pushBreakBtn = document.getElementById("push-break-btn");

const decrementButton = document.getElementById("decrement-btn");
const nextBreakInput = document.getElementById("next-break-input");
const incrementButton = document.getElementById("increment-btn");

let postponeBy = 1;
nextBreakInput.value = postponeBy;

TimerControllerBridge.renderTimerText();

endBreakBtn.addEventListener("click", () => {
    TimerControllerBridge.stopBreak();
});

pushBreakBtn.addEventListener("click", () => {
    TimerControllerBridge.stopBreak(postponeBy);
});

incrementButton.addEventListener("click", () => {
    postponeBy++;
    nextBreakInput.value = postponeBy;
});

decrementButton.addEventListener("click", () => {
    postponeBy--;
    nextBreakInput.value = postponeBy;
});

nextBreakInput.addEventListener("change", () => {
    const value = parseInt(nextBreakInput.value);
    if (isNaN(value)) {
        nextBreakInput.value = postponeBy;
        return;
    }
    postponeBy = value;
});

