import { BrowserWindow, app, shell } from "electron";
import Path from "path";
import Process from "process";
import Url from "url";
import ElectronStore from "electron-store";

const config = new ElectronStore();
let mainWindow: BrowserWindow | null = null;
const htmlUrlPathName = Path.join(__dirname, "/index.html");
const htmlUrl: string = Url.format({
  pathname: htmlUrlPathName,
  protocol: "file:",
  slashes: true
});
const windowBounds = "windowBounds";

const createMainWindow = () => {
  const options: Object = {};
  Object.assign(options, config.get(windowBounds));

  const chooseOptions = () =>
    options !== {}
      ? options
      : {
          width: 800,
          height: 600
        };

  mainWindow = new BrowserWindow(chooseOptions());

  mainWindow.loadURL(htmlUrl);

  mainWindow.webContents.on("new-window", (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  mainWindow.on("close", () => {
    if (mainWindow) {
      config.set(windowBounds, mainWindow.getBounds());
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

app.on("ready", createMainWindow);

app.on("window-all-closed", () => {
  if (Process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});
