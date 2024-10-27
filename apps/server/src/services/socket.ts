import { Server, Socket } from "socket.io";
import { intializeMessageListeners } from "../hanlders/message.js";
import { groupHandler } from "../hanlders/group.js";
import { callHandler } from "../hanlders/call.js";

class SocketServer {
  private _io: Server;

  constructor() {
    this._io = new Server({
      cors: {
        origin: "*",
      },
    });
    console.log("Socket server intialized...");
  }

  attach(server: any) {
    this.io.attach(server);
  }

  public initListeners() {
    const io = this.io;
    console.log("Socket listeners intialized...");
    io.on("connection", (socket: Socket) => {
      console.log(`New Socket Connected`, socket.id);

      // Initialize individual event handlers
      intializeMessageListeners(socket);
      groupHandler(socket);
      callHandler(socket);
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketServer;
