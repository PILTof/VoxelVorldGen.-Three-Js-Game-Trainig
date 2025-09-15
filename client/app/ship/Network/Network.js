import { io } from "socket.io-client";

export default class Network
{
    static Socket = io('http://localhost:3000');

}