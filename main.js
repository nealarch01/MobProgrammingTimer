const { app, BrowserWindow, screen, remote, dialog } = require('electron');
const { ipcMain } = require("electron");
const { createWindows, createMainWindow, createWidgetWindow, initializeWindowEvents } = require("./browser_windows");

const { TimerController } = require("./src/controllers/timer_controller");
const { TeamController } = require("./src/controllers/team_controller")

const { promisify } = require('util')
const prompt = require('electron-prompt')

const promptAsync = promisify(prompt)

// prompt({
//     title: 'example',
//     label: 'add team?',
//     type: 'input'
// }).then((r) => {
//     if (r === null) {
//         console.log('cancelled')
//     }
//     else {
//         console.log('result', r);
//     }
// })
//     .catch(console.error);


const isDev = true;

function initializeTimer(MainWindow, TimerWidgetWindow) {
    const timerController = new TimerController(undefined, MainWindow, TimerWidgetWindow); // TODO: pass in a team timer config
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

}

app.whenReady().then(() => {
    let tc = new TeamController();
    tc.initTeams().then(() => {
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