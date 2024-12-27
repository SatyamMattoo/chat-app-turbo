// socket.ts
"use client";
import { io, Socket } from "socket.io-client";

export const socket: Socket = io("http://localhost:8000", {
  withCredentials: true,
  transports: ["websocket"],
});
