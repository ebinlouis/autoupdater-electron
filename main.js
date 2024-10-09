const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

// Basic Flags
autoUpdater.autoDownload = false; // No auto-download; we'll handle it manually
autoUpdater.autoInstallOnAppQuit = true; // Automatically install on quit after downloading

// Create the browser window
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
        },
    });

    win.loadFile('index.html'); // Load the HTML file
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
    createWindow();

    autoUpdater.checkForUpdates();

    console.log(`Current Version is ${app.getVersion()}`);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Event: Update available
autoUpdater.on('update-available', (info) => {
    dialog
        .showMessageBox({
            type: 'info',
            title: 'Update Available',
            message: `A new update is available. Version ${info.version} is ready. Do you want to download it now?`,
            buttons: ['Yes', 'No'],
        })
        .then((result) => {
            if (result.response === 0) {
                // If 'Yes' is clicked
                autoUpdater.downloadUpdate(); // Start the download manually
            }
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

// Event: Download progress
autoUpdater.on('download-progress', (progressInfo) => {
    console.log(
        `Download speed: ${progressInfo.bytesPerSecond} bytes per second`
    );
    console.log(`Downloaded ${progressInfo.percent.toFixed(2)}%`);
    console.log(
        `(${progressInfo.transferred}/${progressInfo.total}) bytes downloaded`
    );
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
