const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("TimerWidgetBridge", {
    moveTopLeft: () => ipcRenderer.invoke("moveTopLeft"),
    moveBottomRight: () => ipcRenderer.invoke("moveBottomRight"),
    moveTopRight: () => ipcRenderer.invoke("moveTopRight"),
    moveBottomLeft: () => ipcRenderer.invoke("moveBottomLeft")
});

contextBridge.exposeInMainWorld("TimerControllerBridge", {
    startTimer: () => ipcRenderer.invoke("startTimer"),
    stopTimer: () => ipcRenderer.invoke("stopTimer"),
    stopBreak: (postponeBy) => ipcRenderer.invoke("stopBreak", { postponeBy }),
    isActive: () => ipcRenderer.invoke("isActive"),
    renderTimerText: () => ipcRenderer.invoke("renderTimerText"),
});
