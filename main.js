const { app, BrowserWindow, screen } = require('electron');
const { ipcMain } = require("electron");
const { createWindows, createMainWindow, createWidgetWindow, initializeWindowEvents } = require("./browser_windows");

const { TimerController } = require("./src/controllers/timer_controller");
const { TeamController } = require("./src/controllers/team_controller")

const isDev = true;

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
    const timerWidgetWindowSize = {
        width: TimerWidgetWindow.getSize()[0],
        height: TimerWidgetWindow.getSize()[1]
    }
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

function initializeTeamConfig(teamController) {
    ipcMain.handle("saveTeamConfigs", (args) => {
        const { params } = args;
        teamController.saveTimerConfigs(params);
    });
}

app.whenReady().then(() => {
    let tc = new TeamController();
    tc.initTeams().then(()=> {
        console.log(tc.activeQueue);
    })
    initializeTeamConfig(tc);
    console.log(`Node.js version: ${process.versions.node}`);
    const { MainWindow, TimerWidgetWindow } = createWindows();
    initializeWindowEvents(MainWindow, TimerWidgetWindow, app);
    initializeTimerWidget(TimerWidgetWindow);
    initializeTimer(MainWindow, TimerWidgetWindow);
    
});

app.on("window-all-closed", () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});