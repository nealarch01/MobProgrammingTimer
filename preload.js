const { contextBridge, ipcRenderer } = require("electron");
const { screen } = require("electron");
const { windows } = require("./windows");

contextBridge.exposeInMainWorld("TimerWidget", {
    moveTopLeft: () => ipcRenderer.invoke("moveTopLeft"),
    moveBottomRight: () => ipcRenderer.invoke("moveBottomRight"),
    moveTopRight: () => ipcRenderer.invoke("moveTopRight"),
    moveBottomLeft: () => ipcRenderer.invoke("moveBottomLeft")
});

contextBridge.exposeInMainWorld("TimerController", {
    start: () => ipcRenderer.invoke("startTimer"),
    stop: () => ipcRenderer.invoke("stopTimer"),
    isActive: () => ipcRenderer.invoke("isActive"),
    timeRemainingMMSS: () => ipcRenderer.invoke("timeRemainingMMSS"),
});

contextBridge.exposeInMainWorld("models", {
    Timer: () => { return new Timer(); }
});
