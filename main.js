const { app, BrowserWindow } = require('electron');
const path = require('path');

// Create the browser window
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Optional
            nodeIntegration: true,
        },
    });

    win.loadFile('index.html'); // Load the HTML file
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        // On macOS, recreate a window when the app is reactivated
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
