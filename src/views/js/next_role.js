const quoteText = document.getElementById("quote-text");
const authorText = document.getElementById("author-text");
const skipBtn = document.getElementById("skip-btn");
const startBtn = document.getElementById("start-btn");

Quotes.random().then((data) => {
console.log(data);
    quoteText.innerText = data.en;
    authorText.innerText = `- ${data.author}`;
});

skipBtn.addEventListener("click", () => {
    // TODO: Implement later
});

startBtn.addEventListener("click", () => {
    window.location.href = "./control_panel.html";
    const minimizeMainWindow = true;
    TimerControllerBridge.startTimer(minimizeMainWindow);
});

