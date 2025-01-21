import {contextBridge, ipcRenderer} from "electron"
import process from "node:process";


contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron
})


contextBridge.exposeInMainWorld('appConfig', {
    parseProp: async () => {
        console.log(111)
        return await ipcRenderer.invoke("getConfig").then((result) => {
            return result
        })
    }
})

contextBridge.exposeInMainWorld('geoScript', {
    newPage: () => ipcRenderer.invoke("newPage"),
    newPage2: (obj) => ipcRenderer.invoke("newPage2", obj),

    downFile:  (str) => {
        return ipcRenderer.invoke("saveFile", str).then((result)=>result)
    },
    postData: async () => {
        let res = null;
        await ipcRenderer.invoke("postData").then((result) => {
            res = result
        }).finally(() => console.log("end"))
        return res
    },
    checkHistory: (list) => {
        console.log(list)
    }

})

