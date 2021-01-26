/* eslint-disable no-param-reassign */
const path = require('path');

const { app, BrowserWindow, session } = require('electron');
const isDev = require('electron-is-dev');

// Conditionally include the dev tools installer to load React Dev Tools
let installExtension; let
  REACT_DEVELOPER_TOOLS;

if (isDev) {
  const devTools = require('electron-devtools-installer');
  installExtension = devTools.default;
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) {
  app.quit();
}

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    titleBarStyle: 'hidden',
    frame: false,
  });

  // and load the index.html of the app.
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`,
  );

  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  if (isDev) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((error) => console.log(`An error occurred: , ${error}`));
  }

  const filter = {
    urls: [
      'https://auth.riotgames.com/api/v1/authorization',
      'https://entitlements.auth.riotgames.com/api/token/v1',
      'https://auth.riotgames.com/userinfo',
      'https://*.pvp.net/*',
    ],
  };
  // session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
  //   console.log(details);
  //   details.requestHeaders.Origin = null;
  //   details.headers.Origin = null;
  //   callback({ requestHeaders: details.requestHeaders });
  // });
  session.defaultSession.webRequest.onHeadersReceived(
    filter,
    (details, callback) => {
      console.log(details);
      details.responseHeaders['Access-Control-Allow-Origin'] = '*';
      details.responseHeaders['Access-Control-Allow-Headers'] = 'Content-Type';
      details.responseHeaders['Access-Control-Expose-Headers'] = '*';
      callback({ responseHeaders: details.responseHeaders });
    },
  );
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

process.on('exit', () => {
  app.quit();
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
