import { Socket } from "socket.io";

export const callHandler = (socket: Socket) => {
  // Handle call offer
  socket.on("event:call_offer", ({ offer, receiverId }) => {
    console.log(`Call offer from ${socket.data.user.id} to ${receiverId}`);
    socket.to(receiverId).emit("event:call_offer", {
      offer,
      callerId: socket.data.user.id,
    });
  });

  // Handle call answer
  socket.on("event:call_answer", ({ answer, callerId }) => {
    console.log(`Call answer from ${socket.data.user.id} to ${callerId}`);
    socket.to(callerId).emit("event:call_answer", { answer });
  });

  // Handle ICE candidate exchange
  socket.on("event:ice_candidate", ({ candidate, targetId }) => {
    console.log(
      `ICE candidate from ${socket.data.user.id} to ${targetId}`
    );
    socket.to(targetId).emit("event:ice_candidate", { candidate });
  });

  // Handle call disconnection
  socket.on("event:call_end", ({ targetId }) => {
    console.log(
      `User ${socket.data.user.id} ended the call with ${targetId}`
    );
    socket.to(targetId).emit("event:call_end", {
      callerId: socket.data.user.id,
    });
  });
};
