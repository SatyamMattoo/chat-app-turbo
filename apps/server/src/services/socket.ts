import { Server, Socket } from "socket.io";

import { callHandler } from "../controllers/call.js";
import { groupHandler } from "../controllers/group.js";
import { socketMiddleware } from "../middleware/auth.js";
import { intializeMessageListeners } from "../controllers/message.js";

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

    io.use(socketMiddleware)
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
