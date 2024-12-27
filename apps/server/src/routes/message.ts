import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { getMessages } from "../controllers/message.js";

const router: Router = Router();

router.use(authMiddleware)

// Get all friends for a user
router.get("/:chatId", getMessages);

export default router;
