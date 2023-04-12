const topLeftBtn = document.getElementById('top-left-btn');
const topRightBtn = document.getElementById('top-right-btn');
const bottomLeftBtn = document.getElementById('bottom-left-btn');
const bottomRightBtn = document.getElementById('bottom-right-btn');

topLeftBtn.addEventListener("click", () => {
    TimerWidgetBridge.moveTopLeft();
});

topRightBtn.addEventListener("click", () => {
    TimerWidgetBridge.moveTopRight();
});

bottomLeftBtn.addEventListener("click", () => {
    TimerWidgetBridge.moveBottomLeft();
});

bottomRightBtn.addEventListener("click", () => {
    TimerWidgetBridge.moveBottomRight();
});