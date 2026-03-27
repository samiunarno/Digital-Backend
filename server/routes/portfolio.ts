import express from "express";
import { getPortfolio, updatePortfolio } from "../controllers/portfolioController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getPortfolio);
router.post("/", protect, updatePortfolio);

export default router;
