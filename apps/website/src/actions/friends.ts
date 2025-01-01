"use server";

import axios from "axios";
import { cookies } from "next/headers";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`
  : "";

const cookieName =
  process.env.ENVIRONMENT === "production"
    ? "__Secure-next-authjs.session-token"
    : "authjs.session-token";

// Server action to fetch friends
export async function fetchFriends(userId: string) {
  const sessionToken = cookies().get(cookieName)?.value;

  if (!sessionToken) {
    throw new Error("Authentication token is missing.");
  }

  try {
    const response = await axios.get(
      `${baseURL}/friends/get_friends/${userId}`,
      {
        headers: {
          Cookie: `${cookieName}=${sessionToken}`,
        },
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching friends:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch friends.",
    );
  }
}

// Server action to fetch friend requests
export async function fetchFriendRequests(userId: string) {
const sessionToken = cookies().get(cookieName)?.value;

  if (!sessionToken) {
    throw new Error("Authentication token is missing.");
  }

  try {
    const response = await axios.get(
      `${baseURL}/friends/friend_requests/${userId}`,
      {
        headers: {
          Cookie: `${cookieName}=${sessionToken}`,
        },
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching friend requests:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch friend requests.",
    );
  }
}

// Server action to add a friend
export async function addFriend(username: string) {
  if (!username) {
    throw new Error("Username is required.");
  }

  const sessionToken = cookies().get(cookieName)?.value;

  if (!sessionToken) {
    throw new Error("Authentication token is missing.");
  }

  try {
    const response = await axios.post(
      `${baseURL}/friends/add_friend`,
      { friendUsername: username },
      {
        headers: {
          Cookie: `${cookieName}=${sessionToken}`,
        },
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error adding friend:",
      error.response?.data || error.message,
    );
    throw new Error(error.response?.data?.message || "Failed to add friend.");
  }
}

// Server action to accept a friend request
export async function acceptFriendRequest(friendId: string) {
  if (!friendId) {
    throw new Error("Friend ID is required.");
  }

  const sessionToken = cookies().get(cookieName)?.value;

  if (!sessionToken) {
    throw new Error("Authentication token is missing.");
  }

  try {
    const response = await axios.post(
      `${baseURL}/friends/accept_friend`,
      { friendId },
      {
        headers: {
          Cookie: `${cookieName}=${sessionToken}`,
        },
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error accepting friend request:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || "Failed to accept friend request.",
    );
  }
}

// Server action to reject a friend request
export async function rejectFriendRequest(friendId: string) {
  if (!friendId) {
    throw new Error("Friend ID is required.");
  }

  const sessionToken = cookies().get(cookieName)?.value;

  if (!sessionToken) {
    throw new Error("Authentication token is missing.");
  }

  try {
    const response = await axios.post(
      `${baseURL}/friends/reject_friend`,
      { friendId },
      {
        headers: {
          Cookie: `${cookieName}=${sessionToken}`,
        },
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error rejecting friend request:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || "Failed to reject friend request.",
    );
  }
}

// Server action to remove a friend
export async function removeFriend(friendId: string) {
  const sessionToken = cookies().get(cookieName)?.value;

  if (!sessionToken) {
    throw new Error("Authentication token is missing.");
  }

  try {
    const response = await axios.delete(`${baseURL}/friends/remove_friend`, {
      data: { friendId },
      headers: {
        Cookie: `${cookieName}=${sessionToken}`,
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Error removing friend:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || "Failed to remove friend.",
    );
  }
}

// Server action to fetch chat messages
export async function fetchMessages(userId: string, chatId: string) {

  const sessionToken = cookies().get(cookieName)?.value;

  if (!sessionToken) {
    throw new Error("Authentication token is missing.");
  }

  try {
    const response = await axios.get(`${baseURL}/messages/${chatId}`, {
      headers: {
        Cookie: `${cookieName}=${sessionToken}`,
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching messages:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch messages.",
    );
  }
}
