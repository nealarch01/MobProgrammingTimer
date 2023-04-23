const topLeftBtn = document.getElementById('top-left-btn');
const topRightBtn = document.getElementById('top-right-btn');
const bottomLeftBtn = document.getElementById('bottom-left-btn');
const bottomRightBtn = document.getElementById('bottom-right-btn');

const timerText = document.getElementById("timer-text");

const circleTimer = document.getElementById("timer-circle");
const circleTimerProperties = window.getComputedStyle(circleTimer);
const maxStrokeDash = parseInt(circleTimerProperties.getPropertyValue("stroke-dasharray"));
var percentageComplete;
var offset;

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