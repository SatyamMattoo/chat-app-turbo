// socket.ts
"use client";
import { io, Socket } from "socket.io-client";

export const socket: Socket = io(process.env.BACKEND_URL, {
  withCredentials: true,
  transports: ["websocket"],
});
