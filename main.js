const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { autoUpdater, AppUpdater } = require('electron-updater');

// Basic Flags
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

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

    win.once('ready-to-show', () => {
        dialog.showMessageBox(win, {
            type: 'info',
            title: 'Alert from Main Process',
            message: `Current Version is ${app.getVersion()}`,
            buttons: ['OK'],
        });
    });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
    createWindow();

    autoUpdater.checkForUpdates();

    console.log(`Current Version is ${app.getVersion()}`);

    app.on('activate', () => {
        // On macOS, recreate a window when the app is reactivated
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

autoUpdater.on('update-available', (info) => {
    dialog.showMessageBox({
        type: 'info',
        title: 'Update Available',
        message: `A new update is available. Version ${info.version} will be downloaded in the background.`,
        buttons: ['OK'],
    });
});

// Event: Update not available
autoUpdater.on('update-not-available', (info) => {
    dialog.showMessageBox({
        type: 'info',
        title: 'No Update Available',
        message: 'You are using the latest version of the application.',
        buttons: ['OK'],
    });
});

// Event: Update downloaded
autoUpdater.on('update-downloaded', (info) => {
    dialog
        .showMessageBox({
            type: 'info',
            title: 'Update Ready to Install',
            message: `Version ${info.version} has been downloaded. The application will now restart to apply the update.`,
            buttons: ['Restart Now'],
        })
        .then(() => {
            autoUpdater.quitAndInstall(); // Restart the app to install the update
        });
});

// Event: Error
autoUpdater.on('error', (error) => {
    dialog.showMessageBox({
        type: 'error',
        title: 'Update Error',
        message: `An error occurred while checking for updates: ${error.message}`,
        buttons: ['OK'],
    });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
