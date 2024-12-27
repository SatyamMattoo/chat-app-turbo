import React from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";

import { ChatUser } from "~/src/types/types";
import FriendRequests from "./FriendRequests";
import AddFriend from "~/src/app/dashboard/AddFriend";

type Props = {
  friends: ChatUser[];
  activeChat: ChatUser | null;
  onSelect: (chat: ChatUser) => void;
  loading: boolean;
};

const FriendsList: React.FC<Props> = ({
  friends,
  activeChat,
  onSelect,
  loading,
}) => {
  return (
    <div className="w-[30%] bg-primary-foreground border-white border-r overflow-y-scroll">
      <div className="p-4">
        <h2 className="flex items-center justify-between text-lg text-center font-semibold bg-primary/80 text-white p-2 rounded-lg mb-4">
          Friends
          <div className="flex justify-center gap-2 items-center">
            <AddFriend />
            <FriendRequests />
          </div>
        </h2>
        {loading ? (
          <p className="text-white text-center">Loading...</p>
        ) : (
          <ul className="space-y-2">
            {friends.map((friend) => (
              <li
                key={friend.id}
                onClick={() => onSelect(friend)}
                className={`flex gap-2 items-center cursor-pointer p-2 border-b border-gray-200 rounded-md ${
                  activeChat?.id === friend.id
                    ? "bg-gray-200"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                <Avatar>
                  <AvatarImage src={friend.image} alt="Profile Image" />
                  <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-gray-800 font-medium">{friend.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FriendsList;
