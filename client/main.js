import entry from "./app/entry";
import Network from "./app/ship/Network/Network";


Network.Socket.on('log', (data) => {
    console.log(data)
})

Network.Socket.on('error', (err) => {
    console.log(err);
})

entry();
