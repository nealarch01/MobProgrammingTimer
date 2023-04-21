const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("TimerWidgetBridge", {
    moveTopLeft: () => ipcRenderer.invoke("moveTopLeft"),
    moveBottomRight: () => ipcRenderer.invoke("moveBottomRight"),
    moveTopRight: () => ipcRenderer.invoke("moveTopRight"),
    moveBottomLeft: () => ipcRenderer.invoke("moveBottomLeft")
});

contextBridge.exposeInMainWorld("TimerControllerBridge", {
    start: () => ipcRenderer.invoke("startTimer"),
    stop: () => ipcRenderer.invoke("stopTimer"),
    isActive: () => ipcRenderer.invoke("isActive"),
    setTimerText: () => ipcRenderer.invoke("setTimerText"),
});

contextBridge.exposeInMainWorld("TeamControllerBridge", {
    saveTeamConfigs: (params) => ipcRenderer.invoke("saveTeamConfigs", params),
    confirmSave: async () => ipcRenderer.invoke("confirmSave"),
    addTeam: async (teamName) => ipcRenderer.invoke("addTeam", teamName),
    removeTeam: async (teamName) => ipcRenderer.invoke("removeTeam", teamName),
});