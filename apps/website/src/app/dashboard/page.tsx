"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import FriendsList from "./FriendsList";
import ChatSection from "./ChatSection";
import { ChatUser } from "~/src/types/types";
import { fetchFriends } from "~/src/actions/friends";

const DashboardPage = () => {
  const { data: session } = useSession();
  const [friends, setFriends] = useState<ChatUser[]>([]);
  const [activeChat, setActiveChat] = useState<ChatUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchFriend = async () => {
      setLoading(true);
      try {
        const { data } = await fetchFriends(session.user?.id!);
        setFriends(data);
      } catch (error) {
        console.error("Failed to fetch friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriend();
  }, [session?.user?.id]);


  return (
    <div className="flex flex-1 h-screen bg-gray-100">
      <FriendsList
        friends={friends}
        activeChat={activeChat}
        onSelect={setActiveChat}
        loading={loading}
      />
      <ChatSection activeChat={activeChat} userId={session?.user?.id!} />
    </div>
  );
};

export default DashboardPage;
