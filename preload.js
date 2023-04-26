const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("TimerWidgetBridge", {
    moveTopLeft: () => ipcRenderer.invoke("moveTopLeft"),
    moveBottomRight: () => ipcRenderer.invoke("moveBottomRight"),
    moveTopRight: () => ipcRenderer.invoke("moveTopRight"),
    moveBottomLeft: () => ipcRenderer.invoke("moveBottomLeft")
});

contextBridge.exposeInMainWorld("TimerControllerBridge", {
    startTimer: (minimize) => ipcRenderer.invoke("startTimer", { minimize }),
    stopTimer: () => ipcRenderer.invoke("stopTimer"),
    skipBreak: (postponeBy) => ipcRenderer.invoke("skipBreak", { postponeBy }),
    isActive: () => ipcRenderer.invoke("isActive"),
    renderTimerText: () => ipcRenderer.invoke("renderTimerText"),
    getAllMembers: () => ipcRenderer.invoke("getAllMembers"),
    updateConfigs: (configs) => ipcRenderer.invoke("updateConfigs", { configs })
});

contextBridge.exposeInMainWorld("TeamControllerBridge", {
    saveTeamConfigs: (timerConfig) => ipcRenderer.invoke("saveTeamConfigs", timerConfig),
    confirmSave: async () => ipcRenderer.invoke("confirmSave"),
    teamNamePrompt: async (title, name) => ipcRenderer.invoke("teamNamePrompt", { title, name }),
    createTeam: async (teamName) => ipcRenderer.invoke("createTeam", { teamName }),
    getAllTeams: async () => ipcRenderer.invoke("getAllTeams"),
    getCurrentTeam: async () => ipcRenderer.invoke("getCurrentTeam"),
    setCurrentTeam: async (selectedIndex) => ipcRenderer.invoke("setCurrentTeam", { selectedIndex }),
});