const teamSelector = document.getElementById("team-selector");

const newTeamBtn = document.getElementById("new-team-btn");
const removeTeamBtn = document.getElementById("remove-team-btn");
const editTeamBtn = document.getElementById("edit-team-btn");

const roundTimeDec = document.getElementById("mob-time-decrementer");
const roundTimeInput = document.getElementById("mob-time-input");
const roundTimeInc = document.getElementById("mob-time-incrementer");

const breakTimeDec = document.getElementById("break-time-decrementer");
const breakTimeInput = document.getElementById("break-time-input");
const breakTimeInc = document.getElementById("break-time-incrementer");

const rndsUntilNextBreakDec = document.getElementById("rounds-before-break-decrementer");
const rndsUntilNextBreakInput = document.getElementById("rounds-before-break-input");
const rndsUntilNextBreakInc = document.getElementById("rounds-before-break-incrementer");

const exitBtn = document.getElementById("exit-btn");
const saveBtn = document.getElementById("save-btn");

let allTeams = [];
let currentTeamIndex = -1;

TeamControllerBridge.getCurrentTeam()
    .then((team) => {
        currentTeamIndex = team.index;
    });

function convertMinutesToSeconds(minutes) {
    return minutes * 60;
}

function convertSecondsToMinutes(seconds) {
    return seconds / 60;
}

function setInputValues() {
    if (currentTeamIndex === -1) {
        roundTimeInput.value = 10;
        breakTimeInput.value = 5;
        rndsUntilNextBreakInput.value = 5;
        teamSelector.value = "-1";
    } else {
        const timerConfig = allTeams[currentTeamIndex].timerConfig;
        roundTimeInput.value = convertSecondsToMinutes(timerConfig.roundTime_SEC);
        breakTimeInput.value = convertSecondsToMinutes(timerConfig.breakTime_SEC);
        rndsUntilNextBreakInput.value = timerConfig.roundsUntilNextBreak;
        teamSelector.value = `${currentTeamIndex}`;
    }
}

teamSelector.addEventListener("change", (event) => {
    currentTeamIndex = parseInt(event.target.value);
    setInputValues();
});

function resetTeamSelector() {
    teamSelector.innerHTML = "";
    const NoneOption = document.createElement("option");
    NoneOption.value = "-1";
    NoneOption.innerHTML = "None";
    teamSelector.add(NoneOption);
}

async function setAllTeams() {
    resetTeamSelector(); 
    allTeams = await TeamControllerBridge.getAllTeams();
    allTeams.forEach((team, index) => {
        let option = document.createElement("option");
        option.value = index;
        option.text = team.name;
        teamSelector.add(option);
    });
    setInputValues();
}

function updateInput(value) {
    value = parseInt(value);
    if (isNaN(value)) {
        return NaN;
    }
    if (value < 0) {
        return NaN;
    }
}



setAllTeams();

let roundTime_MIN = 10;

let breakTime_MIN = 5;

let roundsUntilNextBreak = 1;

roundTimeInput.value = roundTime_MIN;

breakTimeInput.value = breakTime_MIN;

rndsUntilNextBreakInput.value = roundsUntilNextBreak;


// EVENT LISTENERS

roundTimeDec.addEventListener("click", function() {
    roundTime_MIN -= 1;
    if (roundTime_MIN < 1) {
        roundTime_MIN = 1;
    }
    roundTimeInput.value = roundTime_MIN;
});

roundTimeInc.addEventListener("click", function() {
    roundTime_MIN += 1;
    roundTimeInput.value = roundTime_MIN;
    
});

roundTimeInput.addEventListener("change", (event) => {
    let value = parseInt(event.target.value);
    if (isNaN(value)) {
        roundTimeInput.value = roundTime_MIN;
        return;
    }
    if (value < 1) {
        roundTimeInput.value = roundTime_MIN;
        return;
    }
    roundTime_MIN = value;
    roundTimeInput.value = roundTime_MIN;
});

breakTimeInc.addEventListener("click", function() {
    breakTime_MIN += 1;
    breakTimeInput.value = breakTime_MIN;
});

breakTimeDec.addEventListener("click", function() {
    breakTime_MIN -= 1;
    if (breakTime_MIN < 1) {
        breakTime_MIN = 1;
    }
    breakTimeInput.value = breakTime_MIN
});

breakTimeInput.addEventListener("change", (event) => {
    let value = event.target.value;
    if (isNaN(value)) {
        breakTimeInput.value = breakTime_MIN;
        return;
    }
    if (value < 1) {
        breakTimeInput.value = breakTime_MIN;
        return;
    }
    breakTime_MIN = parseInt(event.target.value)
    breakTimeInput.value = breakTime_MIN;
})

rndsUntilNextBreakDec.addEventListener("click", function() {
    roundsUntilNextBreak -= 1;
    if (roundsUntilNextBreak < 0) {
        roundsUntilNextBreak = 0;
    }
    rndsUntilNextBreakInput.value = roundsUntilNextBreak;
});

rndsUntilNextBreakInc.addEventListener("click", function() {
    roundsUntilNextBreak += 1;
    rndsUntilNextBreakInput.value = roundsUntilNextBreak;
});

rndsUntilNextBreakInput.addEventListener("change", (event) => {
    roundsUntilNextBreak = parseInt(event.target.value)
})

saveBtn.addEventListener("click", async function() {
    let saveInput = await TeamControllerBridge.confirmSave();
    if (!saveInput) {
        return;
    }
    const selectedTeam = parseInt(teamSelector.value);
    TeamControllerBridge.setCurrentTeam(selectedTeam);
    const updatedConfigs = await TeamControllerBridge.saveTeamConfigs({
        roundTime_SEC: convertMinutesToSeconds(roundTime_MIN),
        breakTime_SEC: convertMinutesToSeconds(breakTime_MIN),
        roundsUntilNextBreak: roundsUntilNextBreak,
        selectedTeam: currentTeamIndex
    });
    TimerControllerBridge.updateConfigs(updatedConfigs);
    window.location.href = "./control_panel.html";
});

newTeamBtn.addEventListener("click", async function() {
    const input = await TeamControllerBridge.teamNamePrompt();
    if (input === null) {
        prompt("An error occured.");
        return;
    }
    // Check if input exists in allTeams array
    for (let i = 0; i < allTeams.length; i++) {
        if (allTeams[i].name === input) {
            prompt("Team name already exists.");
            return;
        }
    }
    // No duplicate names found, create new team
    const newTeam = await TeamControllerBridge.createNewTeam(input);
    // Refresh the entire page
    window.location.href = "./options.html";
});