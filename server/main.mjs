import express, { json } from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import path, { dirname, join } from "node:path";
import { Server } from "socket.io";
import cors from "cors";
import * as fs from "node:fs";

const app = express();

const corseOptions = {
    origin: "http://localhost:5173",
};
app.use(cors(corseOptions));

const server = createServer(app);
const __dirname = dirname(fileURLToPath(import.meta.url));

const io = new Server(server, {
    cors: corseOptions,
});

io.on("connection", (socket) => {
    socket.emit("log", "connected");
    socket.on("chunk created", (req) => {
        socket.emit("log", req);
    });
});

let jsonParser = json();
app.post("/world/chunk/", jsonParser, (req, resp) => {
    let chunkPath = __dirname + "/generated/world/chunks/" + req.body.name + ".json";
    console.log(chunkPath)
    if (fs.existsSync(chunkPath)) {
        let string = fs.readFileSync(chunkPath);
        let json = JSON.parse(string);
        resp.json({ status: "exist", data: json });
    } else {
        resp.json({ status: "none" });
    }
});

server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});
