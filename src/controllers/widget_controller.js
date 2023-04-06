const topLeftBtn = document.getElementById('top-left-btn');
const topRightBtn = document.getElementById('top-right-btn');
const bottomLeftBtn = document.getElementById('bottom-left-btn');
const bottomRightBtn = document.getElementById('bottom-right-btn');

topLeftBtn.addEventListener("click", () => {
    TimerWidget.moveTopLeft();
});

topRightBtn.addEventListener("click", () => {
    TimerWidget.moveTopRight();
});

bottomLeftBtn.addEventListener("click", () => {
    TimerWidget.moveBottomLeft();
});

bottomRightBtn.addEventListener("click", () => {
    TimerWidget.moveBottomRight();
});