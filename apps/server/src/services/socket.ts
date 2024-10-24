import { Server } from "socket.io";

class SocketServer {
  private _io: Server;
  constructor() {
    this._io = new Server();
    console.log("Socket server initialized");
  }

  getSocket() {
    return this._io;
  }
}

export default SocketServer;
