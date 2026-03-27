import express from "express";
import { getMessages, updateMessageStatus } from "../controllers/messagesController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Protect all message routes
router.use(protect);

router.get("/", getMessages);
router.patch("/:id/replied", updateMessageStatus);

export default router;
