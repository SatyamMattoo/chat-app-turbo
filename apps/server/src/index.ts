import cors from "cors";
import express from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";

import SocketServer from "./services/socket.js";
import friendsRouter from "./routes/friends.js";
import messagesRouter from "./routes/message.js";
import { error } from "./middleware/errorHandler.js";

const main = async () => {
  try {
    const PORT = process.env.PORT || 8000;
    const app = express();

    app.use(
      cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
      }),
    );
    app.use(express.json());

    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use("/api/v1/friends", friendsRouter);
    app.use("/api/v1/messages", messagesRouter);
    // Create an HTTP server
    const server = createServer(app);

    // Initialize SocketServer and attach it to the HTTP server
    const socket = new SocketServer();
    socket.attach(server);

    // Start the HTTP server
    server.listen(PORT, () => {
      console.log(`Listening on port ${PORT}...`);

      // Initialize socket listeners after the server is running
      socket.initListeners();
    });
    //Error Middleware
    app.use(error);
  } catch (error) {
    console.log("Error starting server:", error);
  }
};

main();
