"use client";
import { MdCall, MdVideoCall } from "react-icons/md";
import React, { useEffect, useRef, useState } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { Button } from "@repo/ui/components/ui/button";

import { socket } from "~/src/utils/socket";
import { ChatService } from "~/src/utils/api";
import { ChatUser, Message, MessageType } from "~/src/types/types";

type Props = {
  activeChat: ChatUser | null;
  userId: string;
};

const ChatSection: React.FC<Props> = ({ activeChat, userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (!activeChat) return;
      try {
        const chatMessagesResponse = await ChatService.fetchMessages(
          userId,
          activeChat.id,
        );

        if (
          chatMessagesResponse.success &&
          chatMessagesResponse.data.length > 0
        ) {
          let formattedMessages: Message[] = chatMessagesResponse.data.map(
            (msg: Message) => ({
              ...msg,
              messageType: msg.messageType as MessageType, // Ensure messageType matches the enum
            }),
          );

          setMessages(formattedMessages);
        } else {
          setMessages([]); // Handle empty messages or errors
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchChatMessages();
  }, [activeChat, userId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected", socket.id);
    });
    socket.on("event:message_received", (message: Message) => {
      setMessages((prev) => [
        ...prev,
        { ...message, messageType: message.messageType as MessageType },
      ]);
    });
    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.off("event:message_received");
    };
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;

    const message = {
      content: newMessage,
      receiverId: activeChat.id,
    };

    socket.emit("event:message", message);
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}`, // Temporary ID
        content: newMessage,
        messageType: MessageType.TEXT, // Set the correct type
        createdAt: new Date(),
        status: "SENT",
        senderId: userId,
        receiverId: activeChat.id,
        groupId: null,
      },
    ]);
    setNewMessage("");
  };

  return (
    <div className="flex-1 h-screen p-4">
      {activeChat ? (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-4 bg-primary/80 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              {" "}
              <Avatar>
                <AvatarImage src={activeChat.image} alt="Profile Image" />
                <AvatarFallback>{activeChat.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-lg font-semibold">{activeChat.name}</h2>
            </div>
            <div className="flex items-center gap-3">
              <MdVideoCall size={25} className="cursor-pointer" />
              <MdCall size={25} className="cursor-pointer" />
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((message, index) => (
              <div className="w-full mb-1 flex" key={message.id || index}>
                <span
                  className={`p-2 rounded-md text-white ${
                    message.senderId === userId
                      ? "bg-gray-400 ml-auto"
                      : "bg-primary/80 mr-auto"
                  }`}
                >
                  {message.content}
                </span>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
          <div className="p-4 rounded-b-lg">
            <div className="flex items-center bg-white p-2 rounded-md shadow-inner">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // Prevents the default form submission or newline behavior
                    handleSendMessage(); // Trigger the send message function
                  }
                }}
                className="flex-1 p-2 border-none focus:outline-none focus:ring-0"
                placeholder="Type a message..."
              />
              <Button onClick={handleSendMessage} className="ml-2">
                Send
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-xl font-semibold text-gray-600">
            Select a friend to start chatting
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatSection;
