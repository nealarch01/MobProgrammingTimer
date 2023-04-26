TimerControllerBridge.renderTimerText();

const timerText = document.getElementById("timer-text");
const circleTimer = document.getElementById("timer-circle");
const circleTimerProperties = window.getComputedStyle(circleTimer);
const maxStrokeDash = parseInt(circleTimerProperties.getPropertyValue("stroke-dasharray"));
var percentageComplete;
var offset;

