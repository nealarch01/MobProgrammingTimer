const { app, BrowserWindow, screen } = require('electron')
const { windows, initWindows } = require("./windows");
const path = require('path')

const isDev = true;

app.whenReady().then(() => {
    console.log(`Node.js version: ${process.versions.node}`);
    initWindows();
});

app.on("activate", () => {
    console.log(windows);
    if (windows.MainWindow === null || windows.TimerWidgetWindow === null) {
        return ;
    }
    windows.MainWindow.show();
    windows.TimerWidgetWindow.hide();
});
