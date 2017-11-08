import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';

import './ipc';

const indexUrl = url.format({
  pathname: path.join(__dirname, 'index.html'),
  protocol: 'file:',
  slashes: true
});

let window, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

if (serve) {
  require('electron-reload')(__dirname, { });
}

function createWindow() {
  // Create the browser window.
  window = new BrowserWindow({
    width: 1280,
    height: 720
  });

  // and load the index.html of the app.
  window.loadURL(indexUrl);

  // Open the DevTools.
  if (serve) {
    window.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  window.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    window = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (window === null) {
    createWindow();
  }
});
