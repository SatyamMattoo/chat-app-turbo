import { Router } from "express";
import {
  acceptFriend,
  addFriend,
  getFriends,
  removeFriend,
  getFriendRequests,
  rejectFriendRequest,
} from "../controllers/friends.js";
import { authMiddleware } from "../middleware/auth.js";

const router: Router = Router();

router.use(authMiddleware)

// Get all friends for a user
router.get("/get_friends/:userId", getFriends);

// Add a friend (send a friend request)
router.post("/add_friend", addFriend);

// Accept a friend request
router.post("/accept_friend", acceptFriend);

// Reject a friend request
router.post("/reject_friend", rejectFriendRequest);

// Remove a friend
router.delete("/remove_friend", removeFriend);

// Get pending friend requests for a user
router.get("/friend_requests/:userId", getFriendRequests);

export default router;
