const quoteText = document.getElementById("quote-text");
const authorText = document.getElementById("author-text");
const skipBtn = document.getElementById("skip-btn");
const startBtn = document.getElementById("start-btn");

const driverText = document.getElementById("driver-text");
const navigatorText = document.getElementById("navigator-text");

function renderRolesText() {
    TimerControllerBridge.getAllMembers()
        .then((members) => {
            if (members.active.length > 1) {
                driverText.innerText = `Driver: ${members.active[0].name}`;
                navigatorText.innerText = `Navigator: ${members.active[1].name}`;
            }
        });
}

Quotes.random().then((data) => {
    quoteText.innerText = data.en;
    authorText.innerText = `- ${data.author}`;
});

skipBtn.addEventListener("click", () => {
    TimerControllerBridge.updateRoles();
    renderRolesText();
});

startBtn.addEventListener("click", () => {
    window.location.href = "./control_panel.html";
    const minimizeMainWindow = true;
    TimerControllerBridge.startTimer(minimizeMainWindow);
});

//renderRolesText();

TimerControllerBridge.getAllMembers()
    .then((members) => {
        if (members.active.length > 1) {
            driverText.innerText = `Driver: ${members.active[0].name}`;
            navigatorText.innerText = `Navigator: ${members.active[1].name}`;
        }
        else if (members.active.length === 1){
            driverText.innerText = `Driver: ${members.active[0].name}`;
        }
});