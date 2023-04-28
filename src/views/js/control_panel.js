const toggleTimerBtn = document.getElementById("start-stop-btn");
const toggleTimerText = document.getElementById("start-stop-text");
const optionsBtn = document.getElementById("options-btn");
const statsBtn = document.getElementById("stats-btn");

const teamNameText = document.getElementById("team-name-text");
const driverText = document.getElementById("driver-text");
const navigatorText = document.getElementById("navigator-text");

TeamControllerBridge.getCurrentTeam()
    .then((team) => {
        teamNameText.innerText = `Team: ${team.data.name}`;
        if (team.data.members.length < 2) {
            return;
        }
        driverText.innerText = `Driver: ${team.data.members[0].name}`;
        navigatorText.innerText = `Navigator: ${team.data.members[1].name}`;
    });

document.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
        event.preventDefault();
    }
});

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
    if (toggleTimerText.innerText === "Start") {
        toggleTimerText.innerText = "Stop";
    } else {
        toggleTimerText.innerText = "Start";
    }
}

function activate() {
    disableButtons();
    const shouldMinimizeMainWindow = true;
    TimerControllerBridge.startTimer(shouldMinimizeMainWindow);
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

optionsBtn.addEventListener("click", () => {
    window.location.href = "./options.html";
});

statsBtn.addEventListener("click", () => {
    window.location.href = "./statistics.html";
});
