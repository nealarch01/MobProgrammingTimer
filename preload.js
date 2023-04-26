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
    saveTeamConfigs: (params) => ipcRenderer.invoke("saveTeamConfigs", params),
    confirmSave: async () => ipcRenderer.invoke("confirmSave"),
    teamNamePrompt: async () => ipcRenderer.invoke("teamNamePrompt"),
    createTeam: async (teamName) => ipcRenderer.invoke("createTeam", { teamName }),
    getAllTeams: async () => ipcRenderer.invoke("getAllTeams"),
    getCurrentTeam: async () => ipcRenderer.invoke("getCurrentTeam"),
    setCurrentTeam: async (selectedIndex) => ipcRenderer.invoke("setCurrentTeam", { selectedIndex }),
});