import { Socket } from "socket.io";
import { prisma } from "../utils/prisma.js";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../middleware/errorHandler.js";

interface Message {
  receiverId: string;
  content: MessageType;
}

enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
  CALL = "call",
}

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user.id;
    const chatId = req.params.chatId;

    // Fetch messages where the authenticated user is either the sender or receiver
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: chatId },
          { senderId: chatId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: "asc" }, // Sort messages by time
    });

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    next(new ErrorHandler("Unable to retrieve messages", 500));
  }
};

const sendMessage = (socket: Socket) => {
  socket.on("event:message", async ({ content, receiverId }: Message) => {
    try {
      const senderId = socket.data.user.id;
      const senderUsername = socket.data.user.name;

      // Validate if the receiver exists
      const receiver = await prisma.user.findUnique({
        where: { id: receiverId },
      });

      if (!receiver) {
        console.error("Receiver not found.");
        return;
      }

      // Save the message to the database
      const message = await prisma.message.create({
        data: {
          senderId,
          receiverId,
          content,
        },
      });

      // Emit the message to the receiver's room
      socket.to(receiverId).emit("event:message_received", {
        messageId: message.id,
        senderId,
        content,
        createdAt: message.createdAt,
      });

      console.log(
        `Message sent from ${senderUsername} to ${receiver.name}:`,
        content,
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });
};


const receiveMessage = (socket: Socket) => {
  socket.on("event:message_received", async ({ messageId }) => {
    try {
      console.log("Message received:", messageId);
      const receiverId = socket.data.user.id;

      // Update message status in the database
      await prisma.message.update({
        where: { id: messageId },
        data: { status: "DELIVERED" },
      });

      console.log(`Message ${messageId} delivered to user ${receiverId}`);

      // Optionally notify the sender about the message status update
      socket.to(receiverId).emit("event:message_status_update", {
        messageId,
        status: "DELIVERED",
      });
    } catch (error) {
      console.error("Error in message receipt handling:", error);
    }
  });
};

// Initialize message listeners
export const initializeMessageListeners = (socket: Socket) => {
  sendMessage(socket);
  receiveMessage(socket);
};
