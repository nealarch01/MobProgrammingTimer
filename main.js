const { app, BrowserWindow, screen } = require('electron');
const { ipcMain } = require("electron");
const { createWindows, createMainWindow, createWidgetWindow, initializeWindowEvents } = require("./browser_windows");

const { TimerController } = require("./src/controllers/timer_controller");

const storage = require('electron-json-storage');
const path = require('path');

const isDev = true;

var activeQueue = [];

var inactiveQueue = [];

var filepath = path.join(__dirname, "./configs");

storage.setDataPath(filepath);

storage.get('placeholder',function(err, res) { //TODO: placeholder should be team configs
    if (err) console.log(err);

    console.log(res); //remove this

    if(res == undefined) {
        activeQueue = [];
        inactiveQueue = [];
    }
    else {
        keys = Object.keys(res);
        activeQueue = res[keys[0]];
        inactiveQueue = [];
    }
    console.log(activeQueue);
});


function initializeTimer(MainWindow, TimerWidgetWindow) {
    const timerController = new TimerController(undefined, MainWindow, TimerWidgetWindow); // TODO: pass in a team timer config
    ipcMain.handle("startTimer", () => {
        if (timerController.isActive()) {
            return;
        }
        timerController.startTimer();
        MainWindow.minimize();
    });
    ipcMain.handle("stopTimer", () => {
        if (!timerController.isActive()) { return; }
        timerController.stopTimer();
    });
    ipcMain.handle("isActive", async () => {
        return timerController.isActive();
    });
    ipcMain.handle("setTimerText", () => {
        timerController.setTimerText();
    });
}

function initializeTimerWidget(TimerWidgetWindow) {
    const workAreaSize = screen.getPrimaryDisplay().workAreaSize;
    const timerWidgetWindowSize = TimerWidgetWindow.getSize();
    ipcMain.handle("moveTopLeft", () => {
        TimerWidgetWindow.setPosition(0, 0);
    });
    ipcMain.handle("moveTopRight", () => {
        TimerWidgetWindow.setPosition(workAreaSize.width - timerWidgetWindowSize.width, 0);
    });
    ipcMain.handle("moveBottomRight", () => {
        TimerWidgetWindow.setPosition(workAreaSize.width - timerWidgetWindowSize.width, workAreaSize.height - timerWidgetWindowSize.height);
    });
    ipcMain.handle("moveBottomLeft", () => {
        TimerWidgetWindow.setPosition(0, workAreaSize.height - timerWidgetWindowSize.height);
    });
}

function initializeTeams() {
    let 
}

app.whenReady().then(() => {
    console.log(`Node.js version: ${process.versions.node}`);
    const { MainWindow, TimerWidgetWindow } = createWindows();
    MainWindow.on("ready-to-show", () => {
        initializeWindowEvents(MainWindow, TimerWidgetWindow);
    });
    initializeTimerWidget(TimerWidgetWindow);
    initializeTimer(MainWindow, TimerWidgetWindow);
});

app.on("window-all-closed", () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});