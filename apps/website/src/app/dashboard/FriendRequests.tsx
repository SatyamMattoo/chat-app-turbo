import { useSession } from "next-auth/react";
import { FaUserFriends } from "react-icons/fa";
import { toast } from "@repo/ui/hooks/use-toast";
import React, { useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { Button } from "@repo/ui/components/ui/button";
import { ImCross, ImCheckmark } from "react-icons/im";
import { acceptFriendRequest, fetchFriendRequests, rejectFriendRequest } from "~/src/actions/friends";

type FriendRequest = {
  id: string;
  friendId: string;
  user: {
    id: string;
    name: string;
    image: string | null;
    username: string;
  };
};

const FriendRequests = () => {
  const { data: session } = useSession();
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const { data } = await fetchFriendRequests(
          session?.user?.id!,
        );
        setFriendRequests(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load friend requests",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAcceptFriend = async (friendId: string) => {
    try {
      await acceptFriendRequest(friendId);
      setFriendRequests((prev) =>
        prev.filter((request) => request.friendId !== friendId),
      );
      toast({ title: "Success", description: "Friend request accepted" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept friend request",
        variant: "destructive",
      });
    }
  };

  const handleRejectFriend = async (friendId: string) => {
    try {
      await rejectFriendRequest(friendId);
      setFriendRequests((prev) =>
        prev.filter((request) => request.friendId !== friendId),
      );
      toast({ title: "Success", description: "Friend request rejected" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject friend request",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <FaUserFriends
          className="border border-white rounded-full p-1"
          size={25}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Friend Requests</DialogTitle>
          <DialogDescription>
            Manage the friend requests you've received.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : friendRequests.length === 0 ? (
          <div className="text-center text-gray-600 text-xl">
            No friend requests.
          </div>
        ) : (
          <ul className="space-y-3">
            {friendRequests.map((request) => (
              <li
                key={request.id}
                className="flex items-center justify-between p-3 border rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={request.user.image || "/default-avatar.png"}
                      alt={request.user.name}
                    />
                    <AvatarFallback>
                      {request.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{request.user.name}</span>
                  <span className="text-sm text-gray-500">
                    @{request.user.username}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleAcceptFriend(request.user.id)}
                  >
                    <ImCheckmark size={15} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRejectFriend(request.friendId)}
                  >
                    <ImCross size={15} />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FriendRequests;
