const newTeamBtn = document.getElementById("new-team-btn");
const removeTeamBtn = document.getElementById("remove-team-btn");
const editTeamBtn = document.getElementById("edit-team-btn");

const mobTimeDec = document.getElementById("mob-time-decrementer");
const mobTimeInput = document.getElementById("mob-time-input");
const mobTimeInc = document.getElementById("mob-time-incrementer");

const breakTimeDec = document.getElementById("break-time-decrementer");
const breakTimeInput = document.getElementById("break-time-input");
const breakTimeInc = document.getElementById("break-time-incrementer");

const rndBeforeBreakDec = document.getElementById("rounds-before-break-decrementer");
const rndBeforeBreakInput = document.getElementById("rounds-before-break-input");
const rndBeforeBreakInc = document.getElementById("rounds-before-break-incrementer");

const exitBtn = document.getElementById("exit-btn");
const saveBtn = document.getElementById("save-btn");

let tempName = "";

let mobTime_MIN = 0;

let breakTime_MIN = 0;

let RBBTime_MIN = 1;

mobTimeInput.value = mobTime_MIN;

breakTimeInput.value = breakTime_MIN;

rndBeforeBreakInput.value = RBBTime_MIN;

mobTimeDec.addEventListener("click", function() {
    mobTime_MIN -= 1;
    mobTimeInput.value = mobTime_MIN;
});

mobTimeInc.addEventListener("click", function() {
    mobTime_MIN += 1;
    mobTimeInput.value = mobTime_MIN;
    
});

mobTimeInput.addEventListener("change", (event) => {
    mobTime_MIN = parseInt(event.target.value)
})

breakTimeInc.addEventListener("click", function() {
    breakTime_MIN += 1;
    breakTimeInput.value = breakTime_MIN;
});

breakTimeDec.addEventListener("click", function() {
    breakTime_MIN -= 1;
    breakTimeInput.value = breakTime_MIN
});

breakTimeInput.addEventListener("change", (event) => {
    breakTime_MIN = parseInt(event.target.value)
})

rndBeforeBreakDec.addEventListener("click", function() {
    RBBTime_MIN -= 1;
    rndBeforeBreakInput.value = RBBTime_MIN;
});

rndBeforeBreakInc.addEventListener("click", function() {
    RBBTime_MIN += 1;
    rndBeforeBreakInput.value = RBBTime_MIN;
});

rndBeforeBreakInput.addEventListener("change", (event) => {
    RBBTime_MIN = parseInt(event.target.value)
})

saveBtn.addEventListener("click", async function() {
    const params = {
        tempName,
        mobTime_MIN,
        breakTime_MIN,
        RBBTime_MIN
    }
    let saveInput = await TeamControllerBridge.confirmSave();
    if (saveInput === 0)
        TeamControllerBridge.saveTeamConfigs(params);
});

newTeamBtn.addEventListener("click", async function() {
    await TeamControllerBridge.addTeam(tempName);
});