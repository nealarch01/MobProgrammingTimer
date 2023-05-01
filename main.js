const { app, BrowserWindow, screen, remote, dialog, ipcRenderer } = require("electron");
const { ipcMain } = require("electron");
const { createWindows, createMainWindow, createWidgetWindow, initializeWindowEvents } = require("./browser_windows");

const { TimerController } = require("./src/controllers/timer_controller");
const { TeamController } = require("./src/controllers/team_controller");

const { Timer } = require("./src/models/timer_model");

const { promisify } = require("util");
const prompt = require("electron-prompt");

const promptAsync = promisify(prompt);

const quotes = require("./data/quotes.json");


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
        teamController.saveTimerConfigs(newTimerConfig);
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
    ipcMain.handle("teamNamePrompt", async (event, params) => {
        const { title, name } = params;
        return new Promise((resolve, reject) => {
            prompt({
                title: title,
                label: "Team Name: ",
                value: name,
                inputAttrs: {
                    type: "text"
                },
                type: "input",
                buttons: ["Create", "Cancel"],
                defaultId: 0,
                resizable: false,
            }).then((result) => {
                if (result === null) {
                    resolve(null);
                } else {
                    resolve(result);
                }
            });
        });
    })
    ipcMain.handle("createTeam", (event, params) => {
        const { teamName } = params;
        teamController.createTeam(teamName);
    });
    ipcMain.handle("renameTeam", async (event, params) => {
    });
    ipcMain.handle("getAllTeams", async () => {
        return teamController.getAllTeams();
    });
    ipcMain.handle("getCurrentTeam", async () => {
        return teamController.getCurrentTeam();
    });
    ipcMain.handle("setCurrentTeam", async (event, params) => {
        const { selectedIndex } = params;
        if (typeof selectedIndex !== "number") {
            console.log("Error");
            return;
        }
        if (selectedIndex >= teamController.getAllTeams().length) {
            console.log("Error");
            return;
        }
        teamController.setCurrentTeam(selectedIndex);
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

function initializeTeamConfig(teamController) {
    ipcMain.handle("saveTeamConfigs", (event, params) => {
        teamController.saveTimerConfigs(params);
    });
    ipcMain.handle("confirmSave", async () => {
        const options = {
            type: 'question',
            buttons: ['Yes', 'No'],
            defaultId: 0,
            title: 'Confirm Save',
            message: 'Do you want to save your changes?'
        }

        const result = await dialog.showMessageBox(null, options);
        console.log(result.response);
        return result.response;

    });
    ipcMain.handle("addTeam", async () => {
        try {
            const result = await promptAsync({
              title: 'Prompt example',
              label: 'Team Name: ',
              value: 'temp',
              inputAttrs: {
                type: 'text'
              },
              type: 'input'
            })
        
            if (result === null) {
              console.log('User cancelled')
              return null
            } else {
              console.log('Result:', result)
              return result
            }
          } catch (err) {
            console.error('Error:', err)
            return null
          }
        });

    ipcMain.handle("removeTeam", async () => {
        try {
            const result = {
              type: 'question',
              buttons: ['Yes','No'],
              title: 'Remove Team',
              defaultId: 0,
              message: "Are you sure you want to delete this team?"
            }

            const box = await dialog.showMessageBox(null, result);
        
            if (result === null) {
              console.log('User cancelled')
              return null
            } else {
              console.log('Result:', box)
              return box
            }
          } catch (err) {
            console.error('Error:', err)
            return null
          }
    });
    ipcMain.handle("retrieveQueue", () => {
        return teamController.retrieveQueue();
});

}

app.whenReady().then(() => {
    console.log(`Node.js version: ${process.versions.node}`);
    const { MainWindow, TimerWidgetWindow } = createWindows();
    initializeWindowEvents(MainWindow, TimerWidgetWindow, app);
    initializeTimerWidget(TimerWidgetWindow);
    ipcMain.handle("randomQuote", async () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    });
    const teamController = initializeTeamController();
    const timerController = initializeTimerController(MainWindow, TimerWidgetWindow, teamController);
});

app.on("window-all-closed", () => {
    app.quit();
});