const { Timer } = require("./src/models/timer_model");

const timer = new Timer();

let timerInterval = null;
let timeRemaining = timer.roundTime_SEC;
let roundsBeforeBreak = timer.breakTime_SEC;

function setRoundsLeft() {
    roundsBeforeBreak = timer.breakTime_SEC;
}

function setRoundTime() {
    timeRemaining = timer.roundTime_SEC;
}

function setBreakTime() {
    timeRemaining = breakTime_SEC;
}

function setTimerText(MainWindow, TimerWidgetWindow) {
    const updateTimerText = (timeRemaining) => {
        return `document.getElementById("timer-text").innerText = "${timeRemaining}";`;
    }
    MainWindow.webContents.executeJavaScript(updateTimerText(timeRemainingMMSS())); 
    TimerWidgetWindow.webContents.executeJavaScript(updateTimerText(timeRemainingMMSS()));
}

function timeRemainingMMSS() {
    let minutes = Math.floor(timeRemaining / 60);
    let seconds = timeRemaining % 60;
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }
    return `${minutes}:${seconds}`;
}

function isActive() {
    return timerInterval !== null;  
}

function startTimer(MainWindow, TimerWidgetWindow) {
    MainWindow.minimize();
    timerInterval = setInterval(() => {
        if (timeRemaining === 0) {
            stopTimer();
        }
        timeRemaining--;
        setTimerText(MainWindow, TimerWidgetWindow);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

module.exports = {
    setRoundsLeft,
    setRoundTime,
    setBreakTime,
    setTimerText,
    timeRemainingMMSS,
    isActive,
    startTimer,
    stopTimer
}