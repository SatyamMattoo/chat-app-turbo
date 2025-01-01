import { MdAdd } from "react-icons/md";
import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { toast } from "@repo/ui/hooks/use-toast";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { addFriend } from "~/src/actions/friends";


const AddFriend = () => {
  const [username, setUsername] = useState<string>("");

  const handleAddFriend = async () => {
    try {
      const response = await addFriend(username);
      if (response.data.success === true) {
        toast({
          title: "Success",
          description: "Friend request sent successfully.",
        });
      }
      setUsername("");
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error.response.data.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <MdAdd className="border border-white rounded-full p-1" size={25} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
          <DialogDescription>
            Enter the username of the user you want to add.
          </DialogDescription>
        </DialogHeader>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleAddFriend}>Send Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddFriend;
