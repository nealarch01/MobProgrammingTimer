const teamSelector = document.getElementById("team-selector");

const newTeamBtn = document.getElementById("new-team-btn");
const removeTeamBtn = document.getElementById("remove-team-btn");
const renameTeamBtn = document.getElementById("edit-team-btn");

const roundTimeDec = document.getElementById("mob-time-decrementer");
const roundTimeInput = document.getElementById("mob-time-input");
const roundTimeInc = document.getElementById("mob-time-incrementer");

const breakTimeDec = document.getElementById("break-time-decrementer");
const breakTimeInput = document.getElementById("break-time-input");
const breakTimeInc = document.getElementById("break-time-incrementer");

const rndsUntilNextBreakDec = document.getElementById("rounds-until-break-decrementer");
const rndsUntilNextBreakInput = document.getElementById("rounds-until-break-input");
const rndsUntilNextBreakInc = document.getElementById("rounds-until-break-incrementer");

const cancelBtn = document.getElementById("cancel-btn");
const saveBtn = document.getElementById("save-btn");

const addMemberBtn = document.getElementById("add-member-btn");

let allTeams = [];
let toAdd = [];
let toRemove = [];
let selectedTeam = -1;
const personInput = document.getElementById("member-input");
const teamContainer = document.getElementById("team-members-container");

TeamControllerBridge.getCurrentTeam()
    .then((team) => {
        selectedTeam = team.index;
    });

function convertMinutesToSeconds(minutes) {
    return minutes * 60;
}

function convertSecondsToMinutes(seconds) {
    return seconds / 60;
}

function setInputValues() {
    if (selectedTeam == -1) {
        roundTime_MIN = 10;
        breakTime_MIN = 5;
        roundsUntilNextBreak = 3;
    } else {
        const timerConfig = allTeams[selectedTeam].timerConfig;
        roundTime_MIN = convertSecondsToMinutes(timerConfig.roundTime_SEC);
        breakTime_MIN = convertSecondsToMinutes(timerConfig.breakTime_SEC);
        roundsUntilNextBreak = timerConfig.roundsUntilNextBreak;
    }
    roundTimeInput.value = roundTime_MIN;
    breakTimeInput.value = breakTime_MIN;
    rndsUntilNextBreakInput.value = roundsUntilNextBreak;
    teamSelector.value = `${selectedTeam}`;
}

teamSelector.addEventListener("change", (event) => {
    selectedTeam = parseInt(event.target.value);
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
});

cancelBtn.addEventListener("click", async () => {
    const confirmCancel = await Utilities.confirmPrompt("Are you sure you want to cancel?");
    if (confirmCancel) {
        window.location.href = "./control_panel.html";
    }
});

saveBtn.addEventListener("click", async function() {
    const selectedTeam = parseInt(teamSelector.value);
    TeamControllerBridge.setCurrentTeam(selectedTeam);
    const updatedConfigs = await TeamControllerBridge.saveTeamConfigs({
        roundTime_SEC: convertMinutesToSeconds(roundTime_MIN),
        breakTime_SEC: convertMinutesToSeconds(breakTime_MIN),
        roundsUntilNextBreak: roundsUntilNextBreak,
        selectedTeam: selectedTeam
    });
    TimerControllerBridge.updateConfigs(updatedConfigs);
    window.location.href = "./control_panel.html";
});

newTeamBtn.addEventListener("click", async function() {
    const teamName = await TeamControllerBridge.teamNamePrompt("Create Team", "");
    if (teamName === null) {
        return;
    }
    if (teamName.length < 1) {
        prompt("Team name cannot be empty.")
        return;
    }
    // Check if input exists in allTeams array
    for (let i = 0; i < allTeams.length; i++) {
        if (teamName === allTeams[i].name) {
            prompt("Team name already exists.");
            return;
        }
    }
    // No duplicate names found, create new team
    const newTeam = await TeamControllerBridge.createTeam(teamName);
    // alert("New Team Created");
    // Refresh the entire page
    window.location.href = "./options.html";
});

renameTeamBtn.addEventListener("click", async () => {
    // Get the current name of the team
    const currentTeam = allTeams[selectedTeam];
    const input = await TeamControllerBridge.teamNamePrompt("Rename team", currentTeam.name);
    if (input === null) {
        return;
    }
    TeamControllerBridge.renameTeam(input);
    window.location.href = "./options.html";
});

removeTeamBtn.addEventListener("click", async function() {
    await TeamControllerBridge.removeTeam(tempName); //TODO: REMOVE CURRENTLY SELECTED TEAM
});

function addMember() {
    const memberName = personInput.value;
    if (memberName.length < 1) {
        alert("Error: Field cannot be empty.");
        return;
    }
    toAdd.push(memberName);
    var memberItem = document.createElement("div");
    memberItem.className = "member-field";

    var memberNameText = document.createElement("p");
    memberNameText.className = "name-text";
    memberNameText.innerText = memberName;

    var xBtn = document.createElement("button"); //TODO: MAKE BUTTON LOOK NICER
    xBtn.className = "x-btn";
    xBtn.innerHTML = "x";
    xBtn.addEventListener("click", () => {
        removeMember(memberItem);
    });

    teamContainer.appendChild(memberItem);
    memberItem.appendChild(memberNameText);
    memberItem.appendChild(xBtn);

    personInput.value = "";
    console.log(toAdd);
}

function removeMember(memberItem) {
    const memberName = memberItem.innerText;
    console.log(memberName);
    const index = toAdd.indexOf(memberName); 
    // Check if member is in toAdd array
    if (index > -1) {
        toAdd.splice(index, 1); // Remove from toAdd
    } else {
        toRemove.push(memberName);  // Add to toRemove
    }
    memberItem.remove(); // Remove from DOM
}

addMemberBtn.addEventListener("click", addMember);

personInput.addEventListener("keypress", function(event) {
    if(event.key === 'Enter') {
        addMember();
    }
});