import {contextBridge, ipcRenderer} from "electron"
import process from "node:process";


contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron
})

contextBridge.exposeInMainWorld('geoScript', {
    downFile: async (str) => await ipcRenderer.invoke("saveFile", str),
    newPage: () => ipcRenderer.invoke("newPage"),
    newPage2: (obj) => ipcRenderer.invoke("newPage2", obj),
    postData: async () => {
        let res = null;
        await ipcRenderer.invoke("postData").then((result) => {
            res = result
        }).finally(() => console.log("end"))
        return res
    }

})

