import {Server} from 'socket.io';

let backValue = {
    back: JSON.stringify({
        "type": "FeatureCollection",
        "features": []
    })
}

export function socketTarget() {
    // const app = express();
    // const server = createServer(app);
    const io = new Server(8079, {
        path: "/geo",
        pingTimeout: 10000,
        connectionStateRecovery: {
            maxDisconnectionDuration: 2 * 60 * 1000,
            skipMiddlewares: true,
        }
    });

    io.on('connection', (socket) => {
        console.log('a user connected:' + socket.id);
        socket.on("up", (arg) => {
            backValue.back = arg
            io.emit("accept", arg);
        })
        socket.on("call", (arg, callback) => {
            callback(backValue.back)
        })
    });

    io.on("close", () => {
        console.log("closeing");
    });

    return io
}
