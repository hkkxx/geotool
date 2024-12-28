export const ws={
    url:"ws://localhost:8079/",
    path: "/geo"
}

export const eventType = "storageChange"
export const globalKey = "taVal"
export const eventStore = new Event(eventType, {
    bubbles: true
})

// 手动触发
 const tolocalStorage = (temp) => {
    let cache = (typeof temp == "string") ? temp : JSON.stringify(temp)
    window.localStorage.setItem(globalKey, cache)
    window.dispatchEvent(eventStore);
}

