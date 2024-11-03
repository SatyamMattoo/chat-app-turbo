import { Socket } from "socket.io";

export const callHandler = (socket: Socket) => {
  socket.on("event:call_ended", () => {
    socket.broadcast.emit("event:call_ended");
  });
};
