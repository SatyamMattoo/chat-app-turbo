import { Socket } from "socket.io";
import { prisma } from "../utils/prisma.js";

interface Message {
  senderId: string;
  receiverId: string;
  content: MessageType;
}

enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
  CALL = "call",
}

const sendMessage = (socket: Socket) => {
  socket.on(
    "event:message",
    async ({ content, receiverId, senderId }: Message) => {
      try {
        await prisma.message.create({
          data: {
            senderId,
            receiverId,
            content,
          },
        });

        socket.to(receiverId).emit("event:message_received", content);
        console.log(`Message sent from ${senderId} to ${receiverId}:`, content);
      } catch (error) {
        console.log(error);
      }
    },
  );
};

const receiveMessage = (socket: Socket) => {
  socket.on("event:message_received", async ({ messageId, receiverId }) => {
    try {
      await prisma.message.update({
        where: { id: messageId },
        data: { status: "DELIVERED" },
      });

      console.log(`Message ${messageId} received by ${receiverId}`);

      // Optionally notify the sender about the receipt
      socket.to(receiverId).emit("event:message_status_update", {
        messageId,
        status: "delivered",
      });
    } catch (error) {
      console.error("Error in message receipt handling:", error);
    }
  });
};
export const intializeMessageListeners = (socket: Socket) => {
  sendMessage(socket);
  receiveMessage(socket);
};
