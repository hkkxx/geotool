import {app, BrowserWindow, ipcMain} from "electron"
import process from "node:process";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {Buffer} from "node:buffer";
import {writeFile} from 'node:fs/promises';
import {Menu, shell, screen} from "electron";
import "./appsocket.js"
import {socketTarget} from "./appsocket.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let appWin = null;
const minSize = {width: 400, height: 200,}

const createAppWindow = () => {


    let aboutWin = null;
    const showAbout = () => {
        aboutWin = new BrowserWindow({
            width: 400,
            height: 200,
            resizable: false,
            minimizable: false,
            show: false,
            webPreferences: {
                //多线程的Node.js
                nodeIntegrationInWorker: true,
                preload: path.join(__dirname, "preload.mjs"),
            },
            title: "about",
            autoHideMenuBar: true,
            modal: true,
        })
        aboutWin.loadFile(app.getAppPath().replaceAll("\\", "/") + "/dist-react/src/nested/" + "about.html").catch(err => console.log(err))
    }

    const template = [
        {
            label: 'File',
            submenu: [
                {role: 'close'},
                {role: 'quit'}
            ]
        }, {
            label: 'Edit',
            submenu: [
                {role: 'undo'},
                {role: 'redo'},
                {role: 'cut'},
                {role: 'copy'},
                {role: 'paste'}
            ]
        }, {
            label: 'View',
            submenu: [
                {role: 'reload'},
                {role: 'forceReload'},
                {role: 'toggleDevTools'},
                {type: 'separator'},
                {role: 'resetZoom'},
                {role: 'zoomIn'},
                {role: 'zoomOut'},
                {type: 'separator'},
                {role: 'togglefullscreen'}
            ]
        }, {
            label: 'Window',
            submenu: [
                {role: 'minimize'},
                {role: 'zoom'},
                {type: 'separator'},
                {role: 'front'},
                {type: 'separator'},
                {role: 'window'}
            ]
        },
        {
            role: 'help',
            submenu: [{
                label: 'about',
                click: () => {
                    showAbout();
                    aboutWin.show();
                }
            }, {
                type: 'separator',
            }, {
                label: 'Learn More',
                click: async () => {
                    await shell.openExternal('https://electronjs.org')
                }
            }]
        }]
    const appMenu = Menu.buildFromTemplate(template)

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
        show: false
    })
    appWin.setMenu(appMenu);
    appWin.loadFile(app.getAppPath().replaceAll("\\", "/") + "/dist-react/" + "index.html").catch(err => console.log(err))
    appWin.once('ready-to-show', () => {
        let primaryDisplay = screen.getPrimaryDisplay()
        let {width, height} = primaryDisplay.workAreaSize
        appWin.setSize(width > 1000 ? width / 5 * 2 : 600, height > 1500 ? height / 5 * 2 : 1000)
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
    win.loadFile(app.getAppPath().replaceAll("\\", "/") + "/dist-react/src/nested/" + "page2.html").catch(err => console.log(err))
    win.once('ready-to-show', () => win.show())

}
const createPage = () => {
    const primaryDisplay = screen.getPrimaryDisplay()
    const {width, height} = primaryDisplay.workAreaSize
    const pageWin = new BrowserWindow({
        minWidth: minSize.width,
        minHeight: minSize.height,
        width: width > 1000 ? width / 5 * 2 : 600,
        height: height > 1500 ? height / 5 * 2 : 1000,
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
    pageWin.loadFile(app.getAppPath().replaceAll("\\", "/") + "/dist-react/src/nested/" + "page3.html").catch(err => console.log(err))
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
            const controller = new AbortController();
            const {signal} = controller;
            const data = new Uint8Array(Buffer.from((str)));
            writeFile(`${new Date().toDateString()}.geojson`, data, {signal});
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
    createAppWindow();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
    if (io) {
        io.close();
    }
})
