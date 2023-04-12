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
