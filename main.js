const { app, BrowserWindow, screen } = require('electron');
const { ipcMain } = require("electron");
const { createWindows, createMainWindow, createWidgetWindow } = require("./windows");

const TimerControls = require("./timer");

const isDev = true;

function initializeTimer(MainWindow, TimerWidgetWindow) {
    TimerControls.setTimerText(MainWindow, TimerWidgetWindow);
    ipcMain.handle("startTimer", () => {
        if (TimerControls.isActive()) {
            return;
        }
        TimerControls.startTimer(MainWindow, TimerWidgetWindow);
    });
    ipcMain.handle("stopTimer", () => {
        if (!TimerControls.isActive()) { return; }
        TimerControls.stopTimer();
    });
    ipcMain.handle("isActive", async () => {
        return TimerControls.isActive();
    });
    ipcMain.handle("timeRemainingMMSS", async () => {
        return TimerControls.timeRemainingMMSS();
    });
    ipcMain.handle("setTimerText", () => {
        TimerControls.setTimerText(MainWindow, TimerWidgetWindow);
    });
}

function initializeTimerWidget(TimerWidgetWindow) {
    const workAreaSize = screen.getPrimaryDisplay().workAreaSize;
    const timerWidgetWindowSize = TimerWidgetWindow.getSize();
    ipcMain.handle("moveTopLeft", () => {
        TimerWidgetWindow.setPosition(0, 0);
    });
    ipcMain.handle("moveTopRight", () => {
        TimerWidgetWindow.setPosition(workAreaSize.width - timerWidgetWindowSize[0], 0);
    });
    ipcMain.handle("moveBottomRight", () => {
        TimerWidgetWindow.setPosition(workAreaSize.width - timerWidgetWindowSize[0], workAreaSize.height - timerWidgetWindowSize[1]);
    });
    ipcMain.handle("moveBottomLeft", () => {
        TimerWidgetWindow.setPosition(0, workAreaSize.height - timerWidgetWindowSize[1]);
    });
}

app.whenReady().then(() => {
    console.log(`Node.js version: ${process.versions.node}`);
    const { MainWindow, TimerWidgetWindow } = createWindows();
    initializeTimerWidget(TimerWidgetWindow);
    initializeTimer(MainWindow, TimerWidgetWindow);
});

app.on("window-all-closed", () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});