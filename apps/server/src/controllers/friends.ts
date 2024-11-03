import { NextFunction, Request, Response } from "express";
import { prisma } from "../utils/prisma.js";
import ErrorHandler from "../middleware/errorHandler.js";

// Fetching friends
export const getFriends = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const userId = req.user?.id; // Use authenticated user's ID

  try {
    const friends = await prisma.friendship.findMany({
      where: {
        OR: [{ userId }, { friendId: userId }],
        isMutual: true,
      },
      include: {
        user: true,
        friend: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Friends fetched successfully",
      data: friends.length > 0 ? friends : [],
    });
  } catch (error: any) {
    next(new ErrorHandler("Unable to fetch friends", 500));
  }
};

// Adding a friend
export const addFriend = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const userId = req.user?.id;
    const { friendUsername } = req.body;
  
    if (req.user?.username === friendUsername) {
      return next(new ErrorHandler("You cannot add yourself as a friend", 400));
    }
  
    try {
      const friend = await prisma.user.findUnique({
        where: { username: friendUsername },
      });
      if (!friend) return next(new ErrorHandler("User not found", 404));
  
      const existingRequest = await prisma.friendship.findUnique({
        where: { userId_friendId: { userId, friendId: friend.id } },
      });
      if (existingRequest) return next(new ErrorHandler("Request already sent", 409));
  
      const newFriend = await prisma.friendship.create({
        data: { userId, friendId: friend.id, isMutual: false },
      });
  
      res.status(201).json({
        success: true,
        message: "Friend request sent successfully",
        data: newFriend,
      });
    } catch (error: any) {
      next(new ErrorHandler("Unable to send friend request", 500));
    }
  };
  

// Accepting a friend request
export const acceptFriend = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;
  const { friendId } = req.body;

  try {
    const friendship = await prisma.friendship.updateMany({
      where: {
        OR: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
        isMutual: false,
      },
      data: { isMutual: true },
    });

    if (friendship.count === 0) {
      return next(new ErrorHandler("Friend request not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Friend request accepted successfully",
    });
  } catch (error: any) {
    next(new ErrorHandler("Unable to accept friend request", 500));
  }
};

// Removing a friend
export const removeFriend = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;
  const { friendId } = req.body;

  try {
    const deletedFriendship = await prisma.friendship.deleteMany({
      where: {
        OR: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
        isMutual: true,
      },
    });

    if (deletedFriendship.count === 0) {
      return next(new ErrorHandler("Friendship not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Friend removed successfully",
    });
  } catch (error: any) {
    next(new ErrorHandler("Unable to remove friend", 500));
  }
};

// Fetching friend requests
export const getFriendRequests = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;

  try {
    const requests = await prisma.friendship.findMany({
      where: {
        friendId: userId,
        isMutual: false,
      },
      include: {
        user: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Friend requests fetched successfully",
      data: requests.length > 0 ? requests : [],
    });
  } catch (error: any) {
    next(new ErrorHandler("Unable to fetch friend requests", 500));
  }
};

// Rejecting a friend request
export const rejectFriendRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;
  const { friendId } = req.body;

  try {
    const deletedFriendship = await prisma.friendship.deleteMany({
      where: {
        OR: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
        isMutual: false,
      },
    });

    if (deletedFriendship.count === 0) {
      return next(new ErrorHandler("Friend request not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Friend request rejected successfully",
    });
  } catch (error: any) {
    next(new ErrorHandler("Unable to reject friend request", 500));
  }
};
