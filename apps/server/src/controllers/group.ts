import { Socket } from "socket.io";

export const groupHandler = (socket: Socket) => {
    socket.on("event:group_created", (groupId: string) => {
        socket.join(groupId);
    });
};