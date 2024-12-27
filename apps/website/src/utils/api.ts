import axios from "axios";

import { MessageResponse } from "../types/types";

const baseURL = `http://localhost:8000/api/v1`;

export const friendsAPI = {
  async fetchFriends(userId: string) {
    try {
      const response = await axios.get(
        `${baseURL}/friends/get_friends/${userId}`,
        { withCredentials: true },
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Error fetching friends:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  async fetchFriendRequests(userId: string) {
    try {
      const response = await axios.get(
        `${baseURL}/friends/friend_requests/${userId}`,
        { withCredentials: true },
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Error fetching friend requests:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  async addFriend(username: string) {
    try {
      const response = await axios.post(
        `${baseURL}/friends/add_friend`,
        { friendUsername: username },
        { withCredentials: true },
      );
      console.log(response);
      return response.data;
    } catch (error: any) {
      console.error(
        "Error adding friend:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  async acceptFriendRequest(friendId: string) {
    try {
      const response = await axios.post(
        `${baseURL}/friends/accept_friend`,
        { friendId },
        { withCredentials: true },
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Error accepting friend request:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  async rejectFriendRequest(friendId: string) {
    try {
      const response = await axios.post(
        `${baseURL}/friends/reject_friend`,
        { friendId },
        { withCredentials: true },
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Error rejecting friend request:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  async removeFriend(friendId: string) {
    try {
      const response = await axios.delete(`${baseURL}/friends/remove_friend`, {
        data: { friendId },
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      console.error(
        "Error removing friend:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },
};

export const ChatService = {
  fetchMessages: async (
    userId: string,
    chatId: string,
  ): Promise<MessageResponse> => {
    try {
      const response = await axios.get(`${baseURL}/messages/${chatId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      return { success: false, data: [] };
    }
  },
};
