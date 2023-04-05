const topLeftBtn = document.getElementById('top-left-btn');
const topRightBtn = document.getElementById('top-right-btn');
const bottomLeftBtn = document.getElementById('bottom-left-btn');
const bottomRightBtn = document.getElementById('bottom-right-btn');

topLeftBtn.addEventListener("click", () => {
    timerWidget.moveTopLeft();
});

topRightBtn.addEventListener("click", () => {
    timerWidget.moveTopRight();
});

bottomLeftBtn.addEventListener("click", () => {
    timerWidget.moveBottomLeft();
});

bottomRightBtn.addEventListener("click", () => {
    timerWidget.moveBottomRight();
});
