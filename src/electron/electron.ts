import Project from "@models/Project";
import { app, BrowserWindow, dialog, ipcMain, shell } from "electron";
import { readFile, writeFile } from "fs/promises";
import path from "path";
// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle("saveProjects", async (_, projects: Project[]) => {
  const userData = app.getPath("userData");
  const filePath = path.join(userData, "projects.json");
  const projectsJson = JSON.stringify(projects);
  await writeFile(filePath, projectsJson);
});

ipcMain.handle("loadProjects", async () => {
  const userData = app.getPath("userData");
  const filePath = path.join(userData, "projects.json");
  try {
    const projectsJson = await readFile(filePath);
    return JSON.parse(projectsJson.toString());
  } catch (error) {
    return [];
  }
});

ipcMain.handle("openFileDialog", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory", "dontAddToRecent", "createDirectory"],
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle("openPath", async (_, path: string) => {
  const error = await shell.openPath(path);
  if (error) {
    console.error(error);
  }
});

ipcMain.handle("openExternal", async (_, url: string) => {
  await shell.openExternal(url);
});
