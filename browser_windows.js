const { app, BrowserWindow, screen } = require("electron");
const path = require('path');

const createMainWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 650,
        minimizable: true,
        maximizable: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true
        }
    });
    win.loadFile('./src/views/html/control_panel.html');
    return win;
}

const createWidgetWindow = () => {
    // Debug width and height
    // const width = 500;
    // const height = 300;
    const width = 130; 
    const height = 145; 
	const workAreaSize = screen.getPrimaryDisplay().workAreaSize;
    const win = new BrowserWindow({
        width: width,
        height: height,
        x: workAreaSize.width,
        y: workAreaSize.height - height,
        opacity: 0.4,
        resizable: false,
        show: false,
        frame: false,
        closable: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true
        }
    });
    win.loadFile('./src/views/html/timer_widget.html');
    return win;
}

function initializeWindowEvents(MainWindow, TimerWidgetWindow) {
    MainWindow.on("minimize", (event) => {
        event.preventDefault();
        MainWindow.hide();
        TimerWidgetWindow.show();
    });
    MainWindow.on("show", () => {
        TimerWidgetWindow.hide();
    });
    TimerWidgetWindow.setAlwaysOnTop(true, "floating", 1);
}

function createWindows() {
	let MainWindow = createMainWindow();
	let TimerWidgetWindow = createWidgetWindow();
    return {
        MainWindow,
        TimerWidgetWindow
    }
}

module.exports = {
	createWindows,
    initializeWindowEvents
};
