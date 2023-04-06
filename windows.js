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
    const width = 300; // 300
    const height = 200; // 200
	const workAreaSize = screen.getPrimaryDisplay().workAreaSize;
    const win = new BrowserWindow({
        width: width,
        height: height,
        x: workAreaSize.width,
        y: workAreaSize.height - height,
        opacity: 0.8,
        show: false,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true
        }
    });
    win.loadFile('./src/views/html/timer_widget.html');
    return win;
}

function createWindows() {
	let MainWindow = createMainWindow();
	let TimerWidgetWindow = createWidgetWindow();
    MainWindow.on("show", () => {
        TimerWidgetWindow.hide();
    });
    MainWindow.on("minimize", () => {
        TimerWidgetWindow.show();
    });
    TimerWidgetWindow.setAlwaysOnTop(true, "floating", 1);
    return {
        MainWindow,
        TimerWidgetWindow
    }
}

module.exports = {
	createWindows
};
