import express from "express";
import { getAnalytics, trackVisit } from "../controllers/analyticsController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getAnalytics);
router.post("/track-visit", trackVisit);

export default router;
