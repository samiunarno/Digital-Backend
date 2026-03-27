import express from "express";
import portfolioRoutes from "./portfolio.js";
import contactRoutes from "./contact.js";
import messageRoutes from "./messages.js";
import templateRoutes from "./templates.js";
import analyticsRoutes from "./analytics.js";
import authRoutes from "./auth.js";
import userRoutes from "./userRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/portfolio", portfolioRoutes);
router.use("/contact", contactRoutes);
router.use("/messages", messageRoutes);
router.use("/templates", templateRoutes);
router.use("/analytics", analyticsRoutes);

export default router;
