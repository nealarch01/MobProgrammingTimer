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
});

contextBridge.exposeInMainWorld("TeamControllerBridge", {
    saveTeamConfigs: (params) => ipcRenderer.invoke("saveTeamConfigs", params),
    confirmSave: async () => ipcRenderer.invoke("confirmSave"),
    addTeam: async (teamName) => ipcRenderer.invoke("addTeam", teamName),
    removeTeam: async (teamName) => ipcRenderer.invoke("removeTeam", teamName),
});