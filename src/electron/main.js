import {app, BrowserWindow, ipcMain, dialog} from "electron"
import process from "node:process";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {Buffer} from "node:buffer";
import {writeFile} from 'node:fs';
import {screen} from "electron";
import "./appsocket.js"
import {socketTarget} from "./appsocket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let appWin = null;
const minSize = {width: 400, height: 200,}

// console.log(app.getAppPath().replaceAll("\\", "/") + "/dist-react/" + "geojgeoj.png");

const basepath = app.getAppPath().replaceAll("\\", "/") + "/dist-react/"

const createAppWindow = () => {

    appWin = new BrowserWindow({
        minWidth: minSize.width,
        minHeight: minSize.height,
        webPreferences: {
            // node 集成
            // nodeIntegration: true,
            //多线程的Node.js
            nodeIntegrationInWorker: true,
            preload: path.join(__dirname, "preload.mjs"),
        },
        title: "geo工具",
        autoHideMenuBar: false,
        icon: app.getAppPath().replaceAll("\\", "/") + "/dist-react/" + "geoj.png",
        show: false
    })

    appWin.loadFile(basepath + "index.html").catch(err => console.log(err))
    appWin.once('ready-to-show', () => {
        let primaryDisplay = screen.getPrimaryDisplay()
        let {width, height} = primaryDisplay.workAreaSize
        appWin.setSize(width > 1000 ? Math.floor(width / 2) : 600, height > 1500 ? Math.floor(height / 2) : 1000)
        appWin.show()
    })

}

const createjwd = () => {
    const win = new BrowserWindow({
        width: 400,
        height: 300,
        resizable: false,
        webPreferences: {
            // node 集成
            //  nodeIntegration: true,
            //多线程的Node.js
            nodeIntegrationInWorker: true,
            preload: path.join(__dirname, "preload.mjs"),
        },
        title: "geo工具",
        autoHideMenuBar: true,
        parent: appWin ? appWin : undefined
    })
    win.loadFile(basepath + "src/nested/" + "page2.html").catch(err => console.log(err))
    win.once('ready-to-show', () => win.show())

}
const createPage = () => {
    const primaryDisplay = screen.getPrimaryDisplay()
    const {width, height} = primaryDisplay.workAreaSize
    const pageWin = new BrowserWindow({
        minWidth: minSize.width,
        minHeight: minSize.height,
        width: width > 1000 ? Math.floor(width / 3) : 600,
        height: height > 1500 ? Math.floor(height / 3) : 1000,
        webPreferences: {
            // node 集成
            //  nodeIntegration: true,
            //多线程的Node.js
            nodeIntegrationInWorker: true,
            preload: path.join(__dirname, "preload.mjs"),
        },
        title: "geo工具",
        parent: appWin ? appWin : undefined,
        autoHideMenuBar: false,
        show: false
    })
    pageWin.loadFile(basepath + "src/nested/" + "page3.html").catch(err => console.log(err))
    pageWin.setPosition(appWin.getPosition()[0] + 100, appWin.getPosition()[1] + 30)
    pageWin.once('ready-to-show', () => {
        pageWin.show()
    })

}
let io = null;

app.whenReady().then(() => {
    let dataToPage = null;
    io = socketTarget();
    ipcMain.handle("saveFile", async (event, str) => {
        try {
            let p = await dialog.showOpenDialog(
                {
                    properties: ['openDirectory', 'createDirectory '],
                    message: "选择要保存的文件路径"
                }
            ).then(result => {
                return result.filePaths.length > 0 ? result.filePaths[0] : null
            });

            if (p !== null) {
                let data = new Uint8Array(Buffer.from((str)));
                let ap = path.join(p, `${new Date().toDateString()}.geojson`);

                writeFile(ap, data, (err) => {
                    console.log(err)
                });
                return {code: 0, msg: ap}
            } else {
                return {code: 1, msg: "canceled"}
            }

            // controller.abort();
        } catch (err) {
            console.error(err);
        }
    })
    ipcMain.handle("newPage", () => {
        createjwd();
    })
    ipcMain.handle("newPage2", (event, obj) => {
        dataToPage = obj;
        createPage();
    })
    ipcMain.handle("postData", () => {
        return dataToPage
    })
    ipcMain.handle('getConfig', (event) => {

    })
    ipcMain.handle('checkHistory', (event) => {

    })


    createAppWindow();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
    if (io) {
        io.close();
    }
})
