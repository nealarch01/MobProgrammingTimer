const { app, BrowserWindow, screen, remote, dialog, ipcRenderer } = require("electron");
const { ipcMain } = require("electron");
const { createWindows, createMainWindow, createWidgetWindow, initializeWindowEvents } = require("./browser_windows");

const { TimerController } = require("./src/controllers/timer_controller");
const { TeamController } = require("./src/controllers/team_controller");

const { Timer } = require("./src/models/timer_model");

const { promisify } = require("util");
const prompt = require("electron-prompt");

const quotes = require("./data/quotes.json");

const isDev = true;

function initializeTimerController(MainWindow, TimerWidgetWindow, teamController) {
    const currentTeam = teamController.getCurrentTeam();
    const currentTeamConfig = currentTeam.data.timerConfig;
    const timerController = new TimerController(MainWindow, TimerWidgetWindow, currentTeamConfig, currentTeam.data.members); // TODO: pass in a team timer config

    return timerController;
}

function initializeTeamController() {
    let teamController = new TeamController();
    teamController.initTeams()

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

app.whenReady()
    .then(() => {
    console.log(`Node.js version: ${process.versions.node}`);
    const { MainWindow, TimerWidgetWindow } = createWindows();

    initializeWindowEvents(MainWindow, TimerWidgetWindow, app);
    initializeTimerWidget(TimerWidgetWindow);

    const teamController = initializeTeamController();
    const timerController = initializeTimerController(MainWindow, TimerWidgetWindow, teamController);

    // ipcMain Handlers
    ipcMain.handle("setCurrentTeam", async (event, params) => {
        const { selectedIndex, membersToAdd, membersToRemove, timerConfig } = params;
        const { roundTime_SEC, breakTime_SEC, roundsUntilNextBreak } = timerConfig;
        const newTimerConfig = new Timer(roundTime_SEC, roundsUntilNextBreak, breakTime_SEC);
        if (typeof selectedIndex !== "number") {
            console.log("Error");
            return;
        }
        if (selectedIndex >= teamController.getAllTeams().length) {
            console.log("Error");
            return;
        }

        teamController.setCurrentTeam(selectedIndex);

        membersToAdd.forEach((memberName) => {
            teamController.addMember(memberName);
        });
        membersToRemove.forEach((memberName) => {
            teamController.removeMember(memberName);
        });

        const currentTeam = teamController.getCurrentTeam();
        teamController.saveTimerConfigs(newTimerConfig);
        timerController.updateSelectedTeam(currentTeam.data.timerConfig, currentTeam.data.members);
    });

    // Timer Controller Specific Handlers
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
    ipcMain.handle("resetTimer", () => {
        timerController.resetTimer();
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
    ipcMain.handle("renderCircleTimer", () => {
        timerController.renderCircleTimer();
    });
    ipcMain.handle("getAllMembers", async () => {
        return timerController.getAllMembers();
    });
    ipcMain.handle("updateConfigs", (event, params) => {
        const { configs } = params;
        timerController.updateConfigs(configs);
    });
    ipcMain.handle("updateSelectedTeam", (event, params) => {
        const { timerConfigs, teamMembers } = params;
        timerController.updateSelectedTeam(timerConfigs, teamMembers);
    });
    ipcMain.handle("swapMembers", (event, params) => {
        const { member1, member2 } = params;
        timerController.swapMembers(member1, member2);
    });
    ipcMain.handle("setMemberActive", (event, params) => {
        const { memberName } = params;
        timerController.removeFromInactive(memberName);
    });
    ipcMain.handle("setMemberInactive", (event, params) => {
        const { memberName } = params;
        timerController.addToInactive(memberName);
    });
    ipcMain.handle("updateRoles", () => {
        timerController.updateRoles();
    });


    // Team Controller Specific Handlers
    ipcMain.handle("saveTeamConfigs", async (event, params) => {
        const { roundTime_SEC, breakTime_SEC, roundsUntilNextBreak, selectedTeam } = params;
        const newTimerConfig = new Timer(roundTime_SEC, roundsUntilNextBreak, breakTime_SEC);
        teamController.saveTimerConfigs(newTimerConfig);
        return newTimerConfig;
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
                height: 180,
                width: 400,
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
        const { teamName } = params;
        teamController.renameTeam(teamName);
    });
    ipcMain.handle("getAllTeams", async () => {
        return teamController.getAllTeams();
    });
    ipcMain.handle("getCurrentTeam", async () => {
        return teamController.getCurrentTeam();
    });
    ipcMain.handle("retrieveQueue", () => {
        return teamController.retrieveQueue();
    });
    ipcMain.handle("removeTeam", (event, params) => {
        const { selectedIndex } = params;
        teamController.removeTeam(selectedIndex); 
    });


    // Utility/Misc Handlers
    ipcMain.handle("confirmPrompt", async (event, params) => {
		const { message } = params;
        const options = {
            type: "question",
            buttons: ["Yes", "No"],
            defaultId: 0,
            title: "Confirm",
            message: message
        }
        const result = await dialog.showMessageBox(null, options);
        return result.response === 0 ? true : false;
    });
    ipcMain.handle("randomQuote", async () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    });
});

app.on("window-all-closed", () => {
    app.quit();
});
