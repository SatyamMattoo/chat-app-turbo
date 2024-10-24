import { createServer } from "http";
import SocketServer from "./services/socket";

const main = async () => {
  try {
    const PORT = process.env.PORT || 8000;

    const server = createServer();

    const socket = new SocketServer();
    socket.getSocket().attach(server);

    server.listen(8000, () => {
      console.log(`Listening on port ${PORT}`);
    });

    socket.getSocket().on("connection", (socket) => {
      console.log(`Socket.IO client connected: ${socket.id}`);
    });
  } catch (error) {
    console.log(error);
  }
};

main();
