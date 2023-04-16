const skipBtn = document.getElementById("skip-btn");
const startBtn = document.getElementById("start-btn");

skipBtn.addEventListener("click", () => {
    // TODO: Implement later
});

startBtn.addEventListener("click", () => {
    window.location.href = "./control_panel.html";
    TimerControllerBridge.start();
});

