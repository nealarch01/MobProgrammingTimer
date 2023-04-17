const newTeamBtn = document.getElementById("new-team-btn");
const removeTeamBtn = document.getElementById("remove-team-btn");
const editTeamBtn = document.getElementById("edit-team-btn");

const mobTimeDec = document.getElementById("mob-time-decrementer");
//const mobTimeInput = document.getElementById("mob-time-input");
const mobTimeInc = document.getElementById("mob-time-incrementer");

const breakTimeDec = document.getElementById("break-time-decrementer");
//const breakTimeInput = document.getElementById("break-time-input");
const breakTimeInc = document.getElementById("break-time-incrementer");

const rndBeforeBreakDec = document.getElementById("rounds-before-break-decrementer");
//const rndBeforeBreanInput = document.getElementById("rounds-before-break-input");
const rndBeforeBreakInc = document.getElementById("rounds-before-break-incrementer");

const exitBtn = document.getElementById("exit-btn");
const saveBtn = document.getElementById("save-btn");

let mobTime_MIN = 0;

let breakTime_MIN = 0;

let RBBTime_MIN = 0;

mobTimeDec.addEventListener("click", function() {
    mobTime_MIN =-1;
    
});

mobTimeInc.addEventListener("click", function() {
    mobTime_MIN =+1;
    
});

breakTimeInc.addEventListener("click", function() {
    breakTime_MIN =+1;
    
});

breakTimeDec.addEventListener("click", function() {
    breakTime_MIN =-1;
    
});

rndBeforeBreakDec.addEventListener("click", function() {
    RBBTime_MIN =-1;
    
});

rndBeforeBreakInc.addEventListener("click", function() {
    RBBTime_MIN =+1;
    
});

saveBtn.addEventListener("click", function() {
    const params = {
        mobTime_MIN,
        breakTime_MIN,
        RBBTime_MIN
    }
    
});