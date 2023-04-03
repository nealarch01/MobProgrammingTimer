const { app, BrowserWindow, screen } = require("electron");
const path = require('path')

class Windows {
	constructor() {
		this.MainWindow = null;
		this.TimerWidgetWindow = null;
	}

	isInitialized() {
		if (this.MainWindow === null || this.TimerWidgetWindow === null) {
			return false;
		}
		return true;
	}
}
let windows = new Windows();

const createMainWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 650,
        minimizable: false,
        maximizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    win.loadFile('./src/views/html/control_panel.html');
    return win;
}

// For MacOS when the x button is clicked, do not end the app and open the widget

const createWidgetWindow = () => {
	const workAreaSize = screen.getPrimaryDisplay().workAreaSize;
    const win = new BrowserWindow({
        width: 250,
        height: 150,
        x: workAreaSize.width - 250,
        y: workAreaSize.height - 150,
        show: false,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    win.loadFile('./src/views/html/timer_widget.html');
    return win; // Return a reference
}

function initWindows() {
	if (windows.isInitialized()) {
		return;
	}
	MainWindow = createMainWindow();
	TimerWidgetWindow = createWidgetWindow();
	MainWindow.on("close", (event) => {
        event.preventDefault();
        MainWindow.hide();
        TimerWidgetWindow.show();
	});
    TimerWidgetWindow.setAlwaysOnTop(true, "floating", 1);
	windows.MainWindow = MainWindow;
	windows.TimerWidgetWindow = TimerWidgetWindow;
}

module.exports = {
	windows,
	initWindows
};
