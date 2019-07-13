import { BrowserWindow, app } from "electron";
import Process from "process"
import ElectronStore from "electron-store";

const config = new ElectronStore();
let mainWindow: BrowserWindow | null = null;
const windowBounds = 'windowBounds'

const createMainWindow = () => {
  const options: Object = {};
  Object.assign(options, config.get(windowBounds))

  const chooseOptions = () => options ? options : {
    width: 800,
    height: 600
  }

  mainWindow = new BrowserWindow(chooseOptions())

  mainWindow.loadFile('index.html');

  mainWindow.on('close', () => {
    if (mainWindow) {
      config.set(windowBounds, mainWindow.getBounds())
    }
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createMainWindow);

app.on("window-all-closed", () => {
  if (Process.platform !== 'darwin') {
    app.quit()
  }
})

app.on("activate", () => {
  if (mainWindow === null) {
    createMainWindow()
  }
})
