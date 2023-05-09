const toggleTimerBtn = document.getElementById("start-stop-btn");
const toggleTimerText = document.getElementById("start-stop-text");

const toggleIcon = document.getElementById("toggle-icon")

const skipBtn = document.getElementById("skip-btn");

const resetBtn = document.getElementById("reset-btn");

const optionsBtn = document.getElementById("options-btn");
const statsBtn = document.getElementById("stats-btn");

const teamNameText = document.getElementById("team-name-text");
const driverText = document.getElementById("driver-text");
const navigatorText = document.getElementById("navigator-text");

const activeQueue = document.getElementById("active-queue");
const inactiveList = document.getElementById("inactive-list");

TimerControllerBridge.isActive()
    .then((isActive) => {
        if (isActive) {
            disableButtons();
            disableDragAndDrop();
            toggleStartStopBtnText();
        }
    });

toggleTimerBtn.addEventListener("click", async () => {
    let isActive = await TimerControllerBridge.isActive();
    if (isActive) {
        enableDragAndDrop();
        deactivate();
    } else {
        disableDragAndDrop();
        activate();
    }
    toggleStartStopBtnText();
});

skipBtn.addEventListener("click", async () => {
    deactivate();
    const confirm = await Utilities.confirmPrompt("Are you sure you want to skip the current roles?");
    if (!confirm) {
        activate();
        return;
    }
    TimerControllerBridge.resetTimer();
    TimerControllerBridge.updateRoles();
    if (activeQueue.childElementCount < 1) {
        return;
    }
    const topMemberField = activeQueue.firstElementChild;
    const memberName = topMemberField.firstChild.innerText;
    const originalID = topMemberField.id.split("-")[2];
    activeQueue.removeChild(topMemberField);
    createActiveMemberField(memberName, originalID);
    renderRolesText();
});

resetBtn.addEventListener("click", async () => {
    deactivate();
    const confirm = await Utilities.confirmPrompt("Are you sure you want to reset the timer?");
    if (!confirm) {
        activate();
        return;
    }
    TimerControllerBridge.resetTimer();
});

TeamControllerBridge.getCurrentTeam()
    .then((team) => {
        teamNameText.innerText = `Team: ${team.data.name}`;
    });

function renderRolesText() {
    TimerControllerBridge.getAllMembers()
        .then((members) => {
            if (members.active.length > 1) {
                driverText.innerText = `Driver: ${members.active[0].name}`;
                navigatorText.innerText = `Navigator: ${members.active[1].name}`;
            }
        });
}

TimerControllerBridge.getAllMembers()
    .then((members) => {
        if (members.active.length > 1) {
            driverText.innerText = `Driver: ${members.active[0].name}`;
            navigatorText.innerText = `Navigator: ${members.active[1].name}`;
        }
        members.active.forEach((member, index) => {
            createActiveMemberField(member.name, index);
        });
        members.inactive.forEach((member, index) => {
            createInactiveMemberField(member.name, index);
        });
    });


document.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
        event.preventDefault();
    }
});

function disableButtons() {
    optionsBtn.disabled = true;
    statsBtn.disabled = true;
    const memberFieldxBtns = document.getElementsByClassName("x-btn");
    for (let i = 0; i < memberFieldxBtns.length; i++) {
        memberFieldxBtns[i].disabled = true;
    }
}

function enableButtons() {
    optionsBtn.disabled = false;
    statsBtn.disabled = false;
    const memberFieldxBtns = document.getElementsByClassName("x-btn");
    for (let i = 0; i < memberFieldxBtns.length; i++) {
        memberFieldxBtns[i].disabled = false;
    }
}

function disableDragAndDrop() {
    let allMemberFields = document.getElementsByClassName("member-field");
    for (let i = 0; i < allMemberFields.length; i++) {
        allMemberFields[i].draggable = false;
    }
}

function enableDragAndDrop() {
    let allMemberFields = document.getElementsByClassName("member-field");
    for (let i = 0; i < allMemberFields.length; i++) {
        allMemberFields[i].draggable = true;
    }
}

function toggleStartStopBtnText() {
    if (toggleTimerText.innerText === "Start") {
        toggleTimerText.innerText = "Stop";
        toggleIcon.innerText = "pause";
    } else {
        toggleTimerText.innerText = "Start";
        toggleIcon.innerText = "play_circle";
    }
}

function activate() {
    disableDragAndDrop();
    disableButtons();
    const shouldMinimizeMainWindow = true;
    TimerControllerBridge.startTimer(shouldMinimizeMainWindow);
}

function deactivate() {
    enableDragAndDrop();
    enableButtons();
    TimerControllerBridge.stopTimer();
}

optionsBtn.addEventListener("click", () => {
    window.location.href = "./options.html";
});

statsBtn.addEventListener("click", () => {
    window.location.href = "./statistics.html";
});

function getNameAndID(memberField) {
    return {
        memberName: memberField.firstChild.innerText,
        originalID: memberField.id.split("-")[2]
    }
}

function setMemberActive(memberField) {
    const { memberName, originalID } = getNameAndID(memberField);
    TimerControllerBridge.setMemberActive(memberName);
    memberField.remove();
    createActiveMemberField(memberName, originalID);
}

function setMemberInactive(memberField) {
    const { memberName, originalID } = getNameAndID(memberField);
    TimerControllerBridge.setMemberInactive(memberName);
    memberField.remove();
    createInactiveMemberField(memberName, originalID);
}

function createInactiveMemberField(memberName, memberID) {
    var memberField = document.createElement("div");
    memberField.className = "member-field";
    memberField.id = memberID;
    memberField.draggable = false;
    memberField.style = "cursor: default;";

    var nameText = document.createElement("p");
    nameText.classList.add("name-text");
    nameText.innerText = memberName;

    var xBtn = document.createElement("button");
    xBtn.className = "x-btn";
    xBtn.innerText = "x";
    xBtn.onclick = () => {
        setMemberActive(memberField);
    }

    memberField.appendChild(nameText);
    memberField.appendChild(xBtn);

    inactiveList.appendChild(memberField);
}

function createActiveMemberField(memberName, index) {
    var memberField = document.createElement("div");
    memberField.draggable = true;
    memberField.ondragstart = onDragStart;
    memberField.className = "member-field";
    memberField.id = "member-field-" + index;

    var nameText = document.createElement("p");
    nameText.classList.add("name-text");
    nameText.innerText = memberName;
    
    var xBtn = document.createElement("button");
    xBtn.className = "x-btn";
    xBtn.innerText = "x";
    xBtn.onclick = () => {
        setMemberInactive(memberField);
    }

    memberField.appendChild(nameText);
    memberField.appendChild(xBtn);

    activeQueue.appendChild(memberField);
}

// TeamControllerBridge.retrieveQueue()
//     .then((members) => {
//         members.forEach((member, index) => {
//             createActiveMemberField(member, index);
//         });
//     });

var dragTarget;
function onDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    dragTarget = event.currentTarget;
}

function onDragOver(event) {
    event.preventDefault();
}

function onDrop(event) {
    const id = event.dataTransfer.getData('text');
    var landingNode = event.target;
    var afterTarget = landingNode.nextElementSibling;
    var parent = landingNode.parentNode;

    if (landingNode.className === "x-btn" || landingNode.className === "name-text") {
        landingNode = landingNode.parentNode;
        afterTarget = landingNode.nextElementSibling;
        parent = landingNode.parentNode;
    }

    // If dropped back on to active queue, do nothing
    if (landingNode.id === "active-queue") {
        return;
    }

    if (dragTarget === afterTarget) { // Moving from left to right
        console.log("Condition 1");
        console.log(dragTarget);
        console.log(afterTarget);
        parent.insertBefore(dragTarget, landingNode);  // Swap the two elements
    } else {
        console.log("Condition 2");
        console.log(dragTarget);
        console.log(landingNode);
        dragTarget.replaceWith(landingNode);
        parent.insertBefore(dragTarget, afterTarget);
    }

    const dragTargetName = dragTarget.getElementsByTagName("p")[0].innerText;
    const landingNodeName = landingNode.getElementsByTagName("p")[0].innerText;
    TimerControllerBridge.swapMembers(dragTargetName, landingNodeName);
    renderRolesText();

    // if (dragTarget === afterTarget) { // If dropped on another member
    //     console.log("Condition 1");
    //     parent.insertBefore(dragTarget, landingNode);  // Swap the two elements
    // } else if (landingNode.id === "active-queue") { // If entering the active queue, re-append
    //     console.log("Condition 2");
    //     landingNode.appendChild(dragTarget);
    // } else { // If dropped on itself, do nothing
    //     console.log("Condition 3");
    //     dragTarget.replaceWith(landingNode); // 
    //     parent.insertBefore(dragTarget, afterTarget);
    // }

    event.dataTransfer.clearData();
}

function inactiveOnDrop(event) {
    const id = event.dataTransfer.getData('text');

    let landingNode = event.target;

    if (landingNode.id === "inactive-list") {
        landingNode.appendChild(dragTarget);
    }
    event.dataTransfer.clearData();
}
