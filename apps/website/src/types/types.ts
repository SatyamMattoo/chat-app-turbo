// types.ts
export interface ChatUser {
  id: string;
  name: string;
  image: string;
}

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
  CALL = "call",
}

export interface MessageResponse {
  success: boolean;
  data: Message[];
}

export interface Message {
  id: string;
  content: string | null;
  messageType: MessageType;
  createdAt: Date;
  status: "SENT" | "DELIVERED";
  senderId: string;
  receiverId: string | null;
  groupId: string | null;
}