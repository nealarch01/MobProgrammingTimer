const toggleTimerBtn = document.getElementById("start-stop-btn");
const optionsBtn = document.getElementById("options-btn");
const statsBtn = document.getElementById("stats-btn");

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
    if (toggleTimerBtn.innerText === "Start") {
        toggleTimerBtn.innerText = "Stop";
    } else {
        toggleTimerBtn.innerText = "Start";
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
TeamControllerBridge.retrieveQueue().then ((res) => {
    counter = 0;
    res.members.forEach(element => {

        var teamMember = document.createElement("div");
        var xBtn = document.createElement("button"); //TODO: MAKE BUTTON LOOK NICER
        
        xBtn.onclick = function() {
            teamMember.remove();
            xBtn.remove();
        }

        teamMember.innerHTML = element.name;
        teamMember.className = "team-field";
        teamMember.id = "team-field-" + counter;
        xBtn.className = "del-button";
        xBtn.textContent = "x";
        console.log(teamMember.id);
        teamMember.draggable = true;
        teamMember.ondragstart = onDragStart;
        queueContainer.appendChild(teamMember);
        teamMember.appendChild(xBtn);
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

    if(landingNode.className === "del-button") {
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
