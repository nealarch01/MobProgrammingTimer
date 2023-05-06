const toggleTimerBtn = document.getElementById("start-stop-btn");
const toggleTimerText = document.getElementById("start-stop-text");
toggleTimerBtn.addEventListener("click", async () => {
    let isActive = await TimerControllerBridge.isActive();
    if (isActive) {
        deactivate();
    } else {
        activate();
    }
    toggleStartStopBtnText();
});

const skipBtn = document.getElementById("skip-btn");
skipBtn.addEventListener("click", () => {
    deactivate();
});

const resetBtn = document.getElementById("reset-btn");
resetBtn.addEventListener("click", () => {
    deactivate();
});

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

const queueContainer = document.getElementById("active-queue");
const inactiveContainer = document.getElementById("inactive-list");

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



optionsBtn.addEventListener("click", () => {
    window.location.href = "./options.html";
});

statsBtn.addEventListener("click", () => {
    window.location.href = "./statistics.html";
});

function renderActiveQueue(personData) {
    var memberContainer = document.createElement("div");
    var nameText = document.createElement("p");
    nameText.classList.add("name-text");
    nameText.innerText = personData.name;
    var xBtn = document.createElement("button");

    xBtn.onclick = function () {
        memberContainer.remove();
        xBtn.remove();
    }

    memberContainer.appendChild(nameText);
    memberContainer.className = "team-field";
    memberContainer.id = `${personData.name}`;
    xBtn.className = "x-btn";
    xBtn.textContent = "x";
    xBtn.addEventListener("click", () => {
    });
    // console.log(memberContainer.id);
    memberContainer.draggable = true;
    memberContainer.ondragstart = onDragStart;
    queueContainer.appendChild(memberContainer);
    memberContainer.appendChild(xBtn);
}

function createActiveMemberContainer(member, index) {
    var memberContainer = document.createElement("div");
    memberContainer.draggable = true;
    memberContainer.ondragstart = onDragStart;
    memberContainer.className = "team-field";
    memberContainer.id = "team-field-" + index;

    var nameText = document.createElement("p");
    nameText.classList.add("name-text");
    nameText.innerText = member.name;
    
    var xBtn = document.createElement("button");
    xBtn.className = "x-btn";
    xBtn.textContent = "x";
    xBtn.onclick = () => {
    }

    memberContainer.appendChild(nameText);
    memberContainer.appendChild(xBtn);

    // console.log(memberContainer.id);
    queueContainer.appendChild(memberContainer);
}

function createInactiveMemberContainer(member) {
}

TeamControllerBridge.retrieveQueue().then((members) => {
    members.forEach((member, index) => {
        createActiveMemberContainer(member, index);
    });
});

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
