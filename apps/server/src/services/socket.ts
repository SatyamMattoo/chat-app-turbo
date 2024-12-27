import { Server, Socket } from "socket.io";

import { callHandler } from "../controllers/call.js";
import { groupHandler } from "../controllers/group.js";
import { socketMiddleware } from "../middleware/auth.js";
import { initializeMessageListeners } from "../controllers/message.js";

class SocketServer {
  private _io: Server;

  constructor() {
    this._io = new Server({
      cors: {
        origin: "http://localhost:3001", // Update with your client origin
        credentials: true,
      },
      transports: ["websocket"],
    });
    console.log("Socket server initialized...");
  }

  attach(server: any) {
    this.io.attach(server);
  }

  public initListeners() {
    const io = this.io;

    io.use(socketMiddleware); // Authenticate and attach user data
    console.log("Socket listeners initialized...");

    io.on("connection", (socket: Socket) => {
      const userId = socket.data.user.id;
      console.log(`User ${userId} connected with socket ID: ${socket.id}`);

      // Add user to their own room for multi-device support
      socket.join(userId);

      // Initialize individual event handlers
      initializeMessageListeners(socket);
      groupHandler(socket);
      callHandler(socket);

      // Handle socket disconnection
      socket.on("disconnect", () => {
        console.log(`Socket ${socket.id} disconnected for user ${userId}`);
      });
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketServer;
