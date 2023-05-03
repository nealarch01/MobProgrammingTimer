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

const personInput = document.getElementById("team-members");
const teamContainer = document.getElementById("member-list-ID");

let tempName = "";

let mobTime_MIN = 0;

let breakTime_MIN = 0;

let RBBTime_MIN = 1;

let toAdd = [];

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
        tempName,                                   //TODO: THIS NEEDS TO BE SET TO THE CURRENTLY SELECTED TEAM
        mobTime_MIN,
        breakTime_MIN,
        RBBTime_MIN,
        toAdd
    }
    let saveInput = await TeamControllerBridge.confirmSave();
    if (saveInput === 0)
        TeamControllerBridge.saveTeamConfigs(params);
});

newTeamBtn.addEventListener("click", async function() {
    await TeamControllerBridge.addTeam(tempName);
});

removeTeamBtn.addEventListener("click", async function() {
    await TeamControllerBridge.removeTeam(tempName); //TODO: REMOVE CURRENTLY SELECTED TEAM
});

personInput.addEventListener("keypress", function(k) {

    if(k.key === 'Enter') {

        var person = document.createElement("div");
        var xBtn = document.createElement("button"); //TODO: MAKE BUTTON LOOK NICER
        
        xBtn.onclick = function() {
            person.remove();
            xBtn.remove();
            toAdd.splice(person, 1);
        }

        person.value = personInput.value;
        person.textContent = person.value;
        person.className = "member-field";
        xBtn.textContent = "x";
        person.appendChild(xBtn);
        teamContainer.appendChild(person);
        toAdd.push(person.value);
        personInput.value = "";
        console.log(toAdd);
    }
    
});