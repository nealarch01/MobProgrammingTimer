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
const activeQueue = document.getElementById("team-field-ID");
const queueContainer = document.getElementById("active-queue");

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
TeamControllerBridge.retrieveQueue().then ((res) => {
    counter = 0;
    res.members.forEach(element => {

        var temp = document.createElement("div");
        var xBtn = document.createElement("button"); //TODO: MAKE BUTTON LOOK NICER
        
        xBtn.onclick = function() {
            temp.remove();
            xBtn.remove();
        }

        temp.innerHTML = element.name;
        temp.className = "team-field";
        temp.id = "team-field-" + counter;
        xBtn.className = "exit-button";
        xBtn.textContent = "x";
        console.log(temp.id);
        temp.draggable = true;
        temp.ondragstart = onDragStart;
        queueContainer.appendChild(temp);
        temp.appendChild(xBtn);
        counter += 1;
    });

});

var dragTarget;
function onDragStart(event) {
    event
        .dataTransfer
        .setData('text/plain', event.target.id);

    event
        .currentTarget
        .style
        .backgroundColor = 'red'

    dragTarget = event.currentTarget;

}

function onDragOver(event) {
    event.preventDefault();
}


function onDrop(event) {

    const id = event
      .dataTransfer
      .getData('text');
    
    console.log(event.target);


    const landingNode = event.target;
    const afterTarget = landingNode.nextElementSibling;
    const parent = landingNode.parentNode;

    if(landingNode.className === "exit-button") {
        return
    }

    if(dragTarget === afterTarget) {
        parent.insertBefore(dragTarget, landingNode);
    }
    else if(landingNode.className === "member-list row") {
        console.log("HERE");
        landingNode.appendChild(dragTarget);
    }
    else {
    dragTarget.replaceWith(landingNode);
    parent.insertBefore(dragTarget, afterTarget);
}

    event
        .dataTransfer
        .clearData();
  }

function inactiveOnDrop(event) {
    const id = event
      .dataTransfer
      .getData('text');


    let landingNode = event.target;

    if(landingNode.className === "member-list row")
        landingNode.appendChild(dragTarget);

    event
    .dataTransfer
    .clearData();

}
