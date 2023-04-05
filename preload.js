const { contextBridge, ipcRenderer } = require("electron");
const { screen } = require("electron");
const { windows } = require("./windows");

contextBridge.exposeInMainWorld("timerWidget", {
    moveTopLeft: () => ipcRenderer.invoke("moveTopLeft"),
    moveBottomRight: () => ipcRenderer.invoke("moveBottomRight"),
    moveTopRight: () => ipcRenderer.invoke("moveTopRight"),
    moveBottomLeft: () => ipcRenderer.invoke("moveBottomLeft")
});