import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

export const socket: Socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
  withCredentials: true,
  auth: {
    token: Cookies.get("authjs.session-token"),
  },
  transports: ["websocket", "polling"],
});
