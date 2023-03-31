const { app, BrowserWindow } = require('electron')
const path = require('path')

const isDev = true;

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 650,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    win.loadFile('./src/views/html/control_panel.html')
    if (isDev) {
        win.webContents.openDevTools()
    }
}

app.whenReady().then(() => {
    console.log(process.version);
    createWindow()
});