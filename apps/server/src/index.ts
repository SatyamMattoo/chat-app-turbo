import { createServer } from "http";
import SocketServer from "./services/socket.js";

const main = async () => {
  try {
    const PORT = process.env.PORT || 8000;

    // Create an HTTP server
    const server = createServer();

    // Initialize SocketServer and attach it to the HTTP server
    const socket = new SocketServer();
    socket.attach(server);

    // Start the HTTP server
    server.listen(PORT, () => {
      console.log(`Listening on port ${PORT}...`);
      
      // Initialize socket listeners after the server is running
      socket.initListeners();
    });
  } catch (error) {
    console.log("Error starting server:", error);
  }
};

main();
