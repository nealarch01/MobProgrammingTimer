const { app, BrowserWindow, screen, remote, dialog, ipcRenderer } = require("electron");
const { ipcMain } = require("electron");
const { createWindows, createMainWindow, createWidgetWindow, initializeWindowEvents } = require("./browser_windows");

const { TimerController } = require("./src/controllers/timer_controller");
const { TeamController } = require("./src/controllers/team_controller");

const { Timer } = require("./src/models/timer_model");

const { promisify } = require("util")
const prompt = require("electron-prompt")

const promptAsync = promisify(prompt)

const isDev = true;

function initializeTimerController(MainWindow, TimerWidgetWindow, teamController) {
    const currentTeam = teamController.getCurrentTeam();
    const currentTeamConfig = currentTeam.data.timerConfig;
    const timerController = new TimerController(currentTeamConfig, MainWindow, TimerWidgetWindow); // TODO: pass in a team timer config
    ipcMain.handle("startTimer", (event, params) => {
        const { minimize } = params;
        if (timerController.isActive()) {
            return;
        }
        timerController.startTimer();
        if (minimize === true) {
            MainWindow.minimize();
        }
    });
    ipcMain.handle("stopTimer", () => {
        if (!timerController.isActive()) { return; }
        timerController.stopTimer();
    });
    ipcMain.handle("skipBreak", (event, params) => {
        timerController.skipBreak(params.postponeBy);
    });
    ipcMain.handle("isActive", async () => {
        return timerController.isActive();
    });
    ipcMain.handle("renderTimerText", () => {
        timerController.renderTimerText();
    });
    ipcMain.handle("getAllMembers", async () => {
        return timerController.getAllMembers();
    });
    ipcMain.handle("updateConfigs", (event, params) => {
        const { configs } = params;
        timerController.updateConfigs(configs);
    });
    return timerController;
}

function initializeTeamController() {
    let teamController = new TeamController();
    teamController.initTeams()
    ipcMain.handle("saveTeamConfigs", async (event, params) => {
        const { roundTime_SEC, breakTime_SEC, roundsUntilNextBreak, selectedTeam } = params;
        const newTimerConfig = new Timer(roundTime_SEC, breakTime_SEC, roundsUntilNextBreak);
        teamController.saveTimerConfigs(params);
        return newTimerConfig;
    });
    ipcMain.handle("confirmSave", async () => {
        const options = {
            type: "question",
            buttons: ["Yes", "No"],
            defaultId: 0,
            title: "Confirm Save",
            message: "Do you want to save your changes?"
        }
        const result = await dialog.showMessageBox(null, options);
        return result.response === 0 ? true : false;
    });
    ipcMain.handle("addTeam", async () => {
        try {
            const result = await promptAsync({
                title: "Create Team",
                label: "Team Name: ",
                value: "",
                inputAttrs: {
                    type: "text"
                },
                type: "input"
            });
            return result;
        } catch (err) {
            console.error("Error:", err)
            return null
        }
    });
    ipcMain.handle("renameTeam", async (event, params) => {
        try {
            const result = await promptAsync({
                title: "Rename Team",
                label: "Team Name: ",
                value: params.teamName,
                inputAttrs: {
                    type: "text"
                },
                type: "input"
            });
        } catch (err) {
            return null;
        }
    });
    ipcMain.handle("getAllTeams", async () => {
        return teamController.getAllTeams();
    });
    ipcMain.handle("getCurrentTeam", async () => {
        return teamController.getCurrentTeam();
    });
    return teamController;
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

app.whenReady().then(() => {
    console.log(`Node.js version: ${process.versions.node}`);
    const { MainWindow, TimerWidgetWindow } = createWindows();
    initializeWindowEvents(MainWindow, TimerWidgetWindow, app);
    initializeTimerWidget(TimerWidgetWindow);
    const teamController = initializeTeamController();
    const timerController = initializeTimerController(MainWindow, TimerWidgetWindow, teamController);
});

app.on("window-all-closed", () => {
    // TODO: Fix this
    if (process.platform !== "darwin") {
        app.quit();
    }
});