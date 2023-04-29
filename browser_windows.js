const { app, BrowserWindow, screen, dialog } = require("electron");
const path = require('path');

const createMainWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 675,
        minimizable: true,
        maximizable: false,
        resizable: false,
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
    const width = 115; 
    const height = 145; 
	const workAreaSize = screen.getPrimaryDisplay().workAreaSize;
    const win = new BrowserWindow({
        width: width,
        height: height,
        x: workAreaSize.width - width,
        y: workAreaSize.height - height,
        opacity: 0.5,
        resizable: false,
        minimizable: false,
        maximizable: false,
        show: false,
        frame: false,
        closable: false,
        focusable: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true
        }
    });
    win.loadFile('./src/views/html/timer_widget.html');
    return win;
}

function initializeWindowEvents(MainWindow, TimerWidgetWindow, app) {
    // When the close button is clicked
    MainWindow.on("close", (event) => {
        // Prompt the user if they want to quit or minimize
        const options = {
            type: "question",
            buttons: ["Quit", "Minimize"],
            defaultId: 0,
            title: "",
            message: "Do you want to quit or minimize?"
        }
        const selectedNum = dialog.showMessageBoxSync(null, options)
        if (selectedNum === 1) {
            event.preventDefault();
            MainWindow.minimize();
            return;
        }
        TimerWidgetWindow.destroy();
    });
    app.on("activate", () => { // MacOS
        MainWindow.restore();
    });
    MainWindow.on("minimize", () => {
        TimerWidgetWindow.show();
    });
    MainWindow.on("restore", () => {
        TimerWidgetWindow.hide();
    });
    TimerWidgetWindow.setAlwaysOnTop(true, "floating");
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
